"use server"
import dbConnect from "@/lib/db-connect"
import { ServiceProvider } from "@/models"

// Add this helper function at the top
function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export async function validateReferralCode(code: string): Promise<{
  success: boolean
  message?: string
  data?: {
    referrerId: string
    referrerName: string
    referred: string[]
  }
}> {
  try {
    await dbConnect()
    const referral = await ServiceProvider.findOne({
      referralCode: code
    }, "_id name referred createdAt")

    if (!referral) {
      return {
        success: false,
        message: "Invalid or expired referral code"
      }

    } else if (new Date().getTime() - new Date(referral.createdAt).getTime() > 35 * 24 * 60 * 60 * 1000) {
      // check if user has crossed 35 days since creation, they can't refer
      return {
        success: false,
        message: "Referral code expired after 35 days"
      }
    } else if (referral?.referred?.length > 2) {
      return {
        success: false,
        message: "They Can't refer more! limit exceeded"
      }
    }

    return serialize({
      success: true,
      data: {
        referrerId: referral._id,
        referrerName: referral.name,
        referred: referral.referred,
      }
    })
  } catch (error) {
    console.error("Referral validation error:", error)
    return { success: false, message: "Failed to validate referral code" }
  }
}

const generateUniqueCode = async (attempts = 5): Promise<string | null> => {
  for (let i = 0; i < attempts; i++) {
    const code = Array.from({ length: 6 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('')

    const exists = await ServiceProvider.findOne({ referralCode: code })
    if (!exists) return code
  }
  return null
}

export async function generateReferralToken(providerId: string, customCode?: string): Promise<{
  success: boolean
  message?: string
  data?: {
    referralCode: string
    link: string
  }
}> {
  try {
    await dbConnect()

    // Handle custom code
    if (customCode) {
      const exists = await ServiceProvider.findOne({
        referralCode: customCode.toUpperCase()
      })

      if (exists) {
        return {
          success: false,
          message: "This code is already in use."
        }
      }
    }

    // Generate unique code or use custom code
    const referralCode = customCode ? customCode.toUpperCase() : await generateUniqueCode()

    if (!referralCode) {
      return {
        success: false,
        message: "Failed to generate unique code. Please try again."
      }
    }

    // Update provider with new code
    const result = await ServiceProvider.findByIdAndUpdate(
      providerId,
      { referralCode },
      { new: true }
    )

    if (!result) {
      return {
        success: false,
        message: "Provider not found"
      }
    }

    return {
      success: true,
      data: {
        referralCode,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/auth/service-provider/register?ref=${referralCode}`
      }
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate referral code"
    }
  }
}

export async function updateDownlineCount(userId: string, isIncrement: boolean = true, depth = 0, maxDepth = 10) {
  try {
    if (depth >= maxDepth) return;

    const user = await ServiceProvider.findById(userId)
      .select('referrer')
      .populate('referrer', '_id');

    if (!user?.referrer) {
      console.log(`No referrer found for user: ${userId}`);
      return;
    }

    console.log(`Updating downline for referrer: ${user.referrer._id}, isIncrement: ${isIncrement}, current depth: ${depth}`);

    // Update downline count for the referrer
    const updated = await ServiceProvider.findByIdAndUpdate(
      user.referrer._id,
      { $inc: { downline: isIncrement ? 1 : -1 } },
      { new: true }
    );

    console.log(`Updated downline count for ${user.referrer._id}: ${updated?.downline}`);

    // Recursively update upline
    await updateDownlineCount(user.referrer._id.toString(), isIncrement, depth + 1, maxDepth);
  } catch (error) {
    console.error('Error in updateDownlineCount:', error);
    throw error; // Re-throw to handle in calling function
  }
}

async function updateLevel(userId: string, depth = 0, maxDepth = 10): Promise<boolean | undefined> {
  try {
    if (depth >= maxDepth) return true;

    const user = await ServiceProvider.findById(userId)
      .select('level referrer')
      .populate('referrer', 'level');

    if (!user) return false;
    if (!user.referrer) return true;

    if (user.level > 10) {
      // Reset the user level and update downline counts
      await ServiceProvider.findByIdAndUpdate(userId, { level: 0, referrer: null, downline: 0, referred: [] });
      return true
    }

    const referrerLevel = user.referrer?.level || 0;
    const currentLevel = user.level || 0;

    // Only update if referer level is low or equal to downline users level
    if (referrerLevel <= currentLevel) {
      await ServiceProvider.findByIdAndUpdate(user?.referrer?._id, { level: referrerLevel + 1 });

      return await updateLevel(user?.referrer?._id, depth + 1, maxDepth);
    }
  } catch (error) {
    console.error("Error updating levels:", error);
    return false;
  }
}

export async function completeReferral(referralCode: string, newUserId: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    await dbConnect()
    const referral = await validateReferralCode(referralCode)

    if (!referral?.success) {
      return { success: false, message: "Invalid or expired referral" }
    }

    await ServiceProvider.updateOne(
      { _id: referral?.data?.referrerId },
      {
        $push: { referred: newUserId }
      }
    )

    await ServiceProvider.findByIdAndUpdate(newUserId, {
      referrer: referral?.data?.referrerId
    })

    // Update downline counts first
    await updateDownlineCount(newUserId, true);

    // Update levels if needed (e.g., if the referrer has 2 referred users + 1 then update)
    if (referral?.data?.referred?.length == 2) {
      await updateLevel(newUserId);
    }

    return { success: true }
  } catch (error) {
    console.error("Complete referral error:", error)
    return { success: false, message: "Failed to process referral" }
  }
}

export async function revokeReferral(referralCode: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    await dbConnect()
    const referral = await ServiceProvider.updateOne({
      referralCode
    }, { referralCode: null })

    return { success: true }
  } catch (error) {
    console.error("Revoke referral error:", error)
    return { success: false, message: "Failed to revoke referral" }
  }
}

interface BasicUser {
  _id: string
  name: string
  profileImage?: string
  profession: string,
  downline?: number
};

interface ReferralStats {
  success: boolean
  message?: string
  data?: {
    me?: BasicUser & {
      level?: string,
      profession: {
        _id: string
        name: string
      },
      referralCode?: {
        code: string
        link: string
      }
    },
    referrer?: BasicUser,
    referred?: BasicUser[],
    currentCode?: {
      code: string
      link: string
    },
  }
};

export const getReferralStats = async (providerId: string): Promise<ReferralStats> => {
  try {
    await dbConnect()

    const sp: any = await ServiceProvider.findOne(
      { _id: providerId }
    )
      .select('_id name level profileImage profession referralCode referred referrer downline')
      .populate({
        path: 'referred',
        select: '_id name profileImage profession downline',
        populate: { path: 'profession', select: '_id name' }
      })
      .populate({
        path: 'referrer',
        select: '_id name profileImage profession',
        populate: { path: 'profession', select: '_id name' }
      })
      .populate('profession', '_id name')
      .lean()

    if (!sp) {
      return {
        success: false,
        message: "Provider not found"
      }
    }
    const formatted: ReferralStats["data"] = {
      me: {
        _id: sp._id.toString(),
        name: sp.name,
        level: sp?.level,
        profileImage: sp?.profileImage,
        profession: sp.profession,
        downline: sp.downline || 0,
      },
      referrer: sp.referrer ? {
        _id: sp.referrer._id.toString(),
        name: sp.referrer.name,
        profileImage: sp.referrer.profileImage,
        profession: sp.referrer.profession,
        downline: sp.referrer?.downline || 0,
      } : undefined,
      referred: sp.referred?.map(ref => ({
        _id: ref._id.toString(),
        name: ref.name,
        profileImage: ref.profileImage,
        profession: ref.profession,
        downline: ref?.downline || 0,
      })) || [],
      currentCode: sp.referralCode ? {
        code: sp.referralCode,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/auth/service-provider/register?ref=${sp.referralCode}`,
      } : undefined,
    }

    return serialize({ success: true, data: formatted })
  } catch (error) {
    console.error("Error in getReferralStats:", error)
    return {
      success: false,
      message: "Failed to fetch referral stats",
    }
  }
}
