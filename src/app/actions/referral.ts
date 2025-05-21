"use server"

import dbConnect from "@/lib/db-connect"
import Referral from "@/models/referral"
import ReferralHistory from "@/models/referral-history"
import mongoose from "mongoose"
import type { FormattedReferralData } from "@/types/referral"
// Ensure FormattedReferralData is exported from "@/types/referral"

// Add this helper function at the top
function serializeMongoObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export async function validateReferralCode(code: string) {
  try {
    await dbConnect()
    const referral = await Referral.findOne({ 
      referralCode: code,
      status: 'pending'
    }).populate('referrer', '_id name')

    if (!referral) {
      return { 
        success: false, 
        message: "Invalid or expired referral code" 
      }
    }

    // Serialize the MongoDB objects
    const serializedData = {
      _id: referral._id.toString(),
      referralCode: referral.referralCode,
      referrer: {
        _id: referral.referrer._id.toString(),
        name: referral.referrer.name
      }
    }

    return {
      success: true,
      referral: serializedData
    }
  } catch (error) {
    console.error("Referral validation error:", error)
    return { success: false, message: "Failed to validate referral code" }
  }
}

export async function generateReferralToken(providerId: string, customCode?: string): Promise<any> {
  try {
    await dbConnect()

    if (customCode) {
      const exists = await Referral.findOne({ 
        referralCode: customCode.toUpperCase() 
      })
      
      if (exists) {
        return {
          success: false,
          message: "This code is already in use."
        }
      }
    }

    // Check number of active referrals
    const activeCount = await Referral.countDocuments({
      referrer: providerId,
      status: 'pending'
    })

    if (activeCount >= 5) {
      return {
        success: false,
        message: "You can only have 5 active referral codes at a time."
      }
    }

    // Create new referral
    const newReferral = await Referral.create({
      referrer: providerId,
      referralCode: customCode ? customCode.toUpperCase() : generateRandomCode(),
      status: 'pending'
    })

    return {
      success: true,
      data: {
        code: newReferral.referralCode,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/auth/service-provider/register?ref=${newReferral.referralCode}`,
        createdAt: newReferral.createdAt,
        progress: 0,
        status: 'pending'
      }
    }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, message: "Failed to generate referral code" }
  }
}

// Helper function to generate random code
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function completeReferral(referralCode: string, newUserId: string) {
  try {
    await dbConnect()
    const referral = await Referral.findOne({ 
      referralCode,
      status: 'pending'
    })

    if (!referral) {
      return { success: false, message: "Invalid or expired referral" }
    }

    // Create history record
    await ReferralHistory.create({
      referrer: referral.referrer,
      referralCode: referral.referralCode,
      referred: newUserId,
      status: 'completed',
      completedAt: new Date(),
      commission: referral.commission
    })

    // Update referral status
    referral.referred = newUserId
    referral.status = 'completed'
    await referral.save()

    return { success: true }
  } catch (error) {
    console.error("Complete referral error:", error)
    return { success: false, message: "Failed to process referral" }
  }
}

export async function revokeReferral(referralCode: string) {
  try {
    await dbConnect()
    const referral = await Referral.findOne({ referralCode })
    
    if (!referral) {
      return { success: false, message: "Referral not found" }
    }

    // Create history record
    await ReferralHistory.create({
      referrer: referral.referrer,
      referralCode: referral.referralCode,
      referred: referral.referred,
      status: 'revoked',
      revokedAt: new Date(),
      commission: referral.commission
    })

    // Delete the referral
    await referral.deleteOne()

    return { success: true }
  } catch (error) {
    console.error("Revoke referral error:", error)
    return { success: false, message: "Failed to revoke referral" }
  }
}

export async function revokeReferralCode(providerId: string, referralCode: string) {
  try {
    await dbConnect()
    
    // First check if referral has any progress
    const referral = await Referral.findOne({ 
      referrer: providerId,
      referralCode: referralCode,
      status: 'pending'
    }).populate('referred')

    if (!referral) {
      return { success: false, message: "No active referral found" }
    }

    // If no one has used this code (progress = 0), delete it
    if (!referral.referred) {
      await referral.deleteOne()
      return { success: true }
    }

    // Otherwise mark as revoked
    referral.status = 'revoked'
    referral.revokedAt = new Date()
    await referral.save()

    return { success: true }
  } catch (error) {
    console.error("Revoke error:", error)
    return { success: false, message: "Failed to revoke referral code" }
  }
}

export async function getReferralStats(providerId: string): Promise<{ success: boolean; data?: FormattedReferralData; message?: string }> {
  try {
    await dbConnect()
    
    const allReferrals = await Referral.find({ referrer: providerId })
      .populate('referred', 'name')
      .lean()

    // Serialize all MongoDB objects
    const serializedReferrals = allReferrals.map(ref => ({
      ...ref,
      _id: (ref as any)?._id.toString(),
      referrer: ref.referrer.toString(),
      referred: ref.referred ? {
        _id: ref.referred._id.toString(),
        name: ref.referred.name
      } : null
    }))

    const formatted: FormattedReferralData = {
      activeCodes: [],
      revokedCodes: [],
      completedCodes: [],
      pendingCodes: [],
      currentCode: null,
      stats: {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        revokedReferrals: 0
      }
    }

    if (serializedReferrals?.length > 0) {
      const pending = serializedReferrals.filter((r: any) => r.status === 'pending')
      const revoked = serializedReferrals.filter((r: any) => r.status === 'revoked')
      const completed = serializedReferrals.filter((r: any) => r.status === 'completed')

      formatted.activeCodes = pending.map((r:any) => ({
        code: r.referralCode,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/auth/service-provider/register?ref=${r.referralCode}`,
        createdAt: new Date(r.createdAt).toISOString(),
        progress: 0,
        status: 'pending'
      }))

      formatted.revokedCodes = revoked.map((r: any) => ({
        code: r.referralCode,
        link: '',
        createdAt: new Date(r.createdAt).toISOString(),
        progress: 0,
        status: 'revoked',
        revokedAt: r.revokedAt ? new Date(r.revokedAt).toISOString() : undefined
      }))

      formatted.completedCodes = completed.map((r: any) => ({
        code: r.referralCode,
        link: '',
        createdAt: new Date(r.createdAt).toISOString(),
        progress: 100,
        status: 'completed',
        completedAt: r.completedAt ? new Date(r.completedAt).toISOString() : undefined,
        referredUser: r.referred ? {
          name: r.referred.name,
          registeredAt: r.registeredAt ? new Date(r.registeredAt).toISOString() : new Date().toISOString()
        } : undefined
      }))

      formatted.stats = {
        totalReferrals: serializedReferrals.length,
        successfulReferrals: completed.length,
        pendingReferrals: pending.length,
        revokedReferrals: revoked.length
      }
    }

    return { success: true, data: formatted }
  } catch (error) {
    console.error("Error in getReferralStats:", error)
    return { 
      success: false, 
      message: "Failed to fetch referral stats",
      data: {
        activeCodes: [],
        revokedCodes: [],
        completedCodes: [],
        pendingCodes: [],
        currentCode: null,
        stats: {
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
          revokedReferrals: 0
        }
      }
    }
  }
}

export async function getReferralsByProvider(providerId: string) {
  try {
    await dbConnect()
    const referrals = await Referral.find({ referrer: providerId })
      .populate('referred', 'name')
      .sort({ createdAt: -1 })
      .lean()

    // Transform the data to match ReferralData interface
    return referrals.map(ref => ({
      _id: (ref as any)?._id.toString(),
      referralCode: ref.code,
      referred: ref.referred ? {
        _id: ref.referred._id.toString(),
        name: ref.referred.name
      } : undefined,
      status: ref.status,
      commission: ref.commission || 0,
      createdAt: ref.createdAt
    }))
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return []
  }
}
