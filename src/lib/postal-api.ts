"use server"
import { districts, states, banks } from "indian_address"
const API_URL = 'https://api.postalpincode.in'

export async function getStates(): Promise<string[]> {
    try {
        // This is a mock list since India Post API doesn't provide state list
        return states.sort()
    } catch (error) {
        console.error('Error fetching states:', error)
        return []
    }
}

export async function getCitiesByState(state: string): Promise<string[]> {
    try {
        if (!state) {
            console.warn('No state provided to getCitiesByState')
            return []
        }

        if (!districts[state.toLowerCase()]) {
            console.warn(`No districts found for state: ${state}`)
            return []
        }

        const cityList = districts[state.toLowerCase()]

        return cityList.sort()
    } catch (error) {
        console.error('Error fetching cities:', error)
        return []
    }
}

export async function getPincodeDetails(pincode: string) {
    try {
        const response = await fetch(`${API_URL}/pincode/${pincode}`)
        const data = await response.json()

        if (data[0]?.PostOffice?.[0]) {
            const details = data[0].PostOffice[0]
            return {
                city: details.District,
                state: details.State,
                area: details.Name
            }
        }
        return null
    } catch (error) {
        console.error('Error fetching pincode details:', error)
        return null
    }
}

export async function getBanks(searchTerm: string) {
    try {
        if (!searchTerm) {
            console.warn('No search term provided for getBanks')
            return []
        }

        searchTerm = searchTerm.toLowerCase()
        const bankList = Object.values(banks).filter(bank => 
            bank.toLowerCase().includes(searchTerm)
        )
        
        return Object.entries(banks)
            .filter(([key, value]) => value.toLowerCase().includes(searchTerm))
            .map(([key, value]) => ({ code: key, name: value }))
    } catch (error) {
        console.error('Error fetching pincode details:', error)
        return []
    }
}

export async function getBankByIfsc(ifsc: string) {
    try {
        if (!ifsc) {
            console.warn('No IFSC code provided for getBankByIfsc')
            return null
        }

        const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`)
        if (!response.ok) {
            console.error(`Error fetching bank details for IFSC: ${ifsc}, Status: ${response.status}`)
            return null
        }

        const data = await response.json()
        if (data && data.BANK) {
            return {
                bankCode: data.BANKCODE,
                bank: data.BANK,
                branch: data.BRANCH,
                ifsc: data.IFSC,
                address: data.ADDRESS,
                city: data.CITY,
                state: data.STATE,
                contact: data.CONTACT
            }
        }

        console.warn(`No details found for IFSC: ${ifsc}`)
        return null
    } catch (error) {
        console.error('Error fetching bank details:', error)
        return null
    }
}
