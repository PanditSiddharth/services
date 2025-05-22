"use server"
import { districts, states } from "indian_address"
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
