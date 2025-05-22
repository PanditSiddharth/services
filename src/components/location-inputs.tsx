"use client"

import { useState, useEffect } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getStates, getCitiesByState, getPincodeDetails } from "@/lib/postal-api"

interface LocationInputsProps {
  onStateChange?: (state: string) => void
  onCityChange?: (city: string) => void
  onPincodeChange?: (pincode: string, details?: any) => void
  defaultState?: string
  defaultCity?: string
  defaultPincode?: string
}

export function LocationInputs({
  onStateChange,
  onCityChange,
  onPincodeChange,
  defaultState = "",
  defaultCity = "",
  defaultPincode = ""
}: LocationInputsProps) {
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState(defaultState)
  const [selectedCity, setSelectedCity] = useState(defaultCity)
  const [pincode, setPincode] = useState(defaultPincode)
  const [isLoading, setIsLoading] = useState(true)
  const [isCityLoading, setIsCityLoading] = useState(false)

  // Load states on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const statesList = await getStates()
        setStates(statesList || [])
      } catch (error) {
        console.error('Error loading states:', error)
        setStates([])
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handlePincodeChange = async (value: string) => {
    setPincode(value)
    
    // Clear state and city if pincode is empty
    if (!value) {
      setSelectedState("")
      setSelectedCity("")
      onStateChange?.("")
      onCityChange?.("")
      return
    }

    // Auto-fetch details when pincode is 6 digits
    if (value.length === 6) {
      try {
        const details = await getPincodeDetails(value)
        if (details) {
          console.log(details)
          // Auto-select state and city
          setSelectedState(details.state)
          setSelectedCity(details.city)
          onStateChange?.(details.state)
          onCityChange?.(details.city)
          onPincodeChange?.(value, details)
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error)
      }
    }
  }

  const handleStateChange = async (value: string) => {
    setSelectedState(value)
    setSelectedCity("") // Clear previous city
    onStateChange?.(value)
    onCityChange?.("") // Clear previous city selection
    
    // Immediately fetch cities for selected state
    if (value) {
      try {
        const cities = await getCitiesByState(value)
        console.log('Fetched cities:', cities)
        setCities(cities || [])
      } catch (error) {
        console.error('Error loading cities:', error)
        setCities([])
      }
    } else {
      setCities([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => handlePincodeChange(e.target.value)}
          maxLength={6}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="state">State</Label>
        <Select
          value={selectedState}
          onValueChange={handleStateChange}
        >
          <SelectTrigger id="state">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states?.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city">City</Label>
        <Select
          value={selectedCity}
          onValueChange={(city) => {
            setSelectedCity(city)
            onCityChange?.(city)
          }}
          disabled={!selectedState}
        >
          <SelectTrigger id="city">
            <SelectValue placeholder={!selectedState ? "Select state first" : "Select city"} />
          </SelectTrigger>
          <SelectContent>
            {cities?.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
