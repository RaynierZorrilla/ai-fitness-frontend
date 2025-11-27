import { useState, useEffect } from "react"
import { apiService } from "@/lib/services/api.service"
import type { Profile } from "@/lib/types"

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.getProfile()
      setProfile(data.profile)
      return data.profile
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.updateProfile(profileData)
      setProfile(data.profile)
      return { success: true, profile: data.profile }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  }
}

