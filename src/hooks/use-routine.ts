import { useState } from "react"
import { useWorkoutStore } from "@/lib/store/workout.store"
import { apiService } from "@/lib/services/api.service"

export function useRoutine() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentRoutine, setCurrentRoutine, todayRoutine, setTodayRoutine } = useWorkoutStore()

  const generateRoutine = async (profileData: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const data: any = await apiService.generateRoutine(profileData)
      setCurrentRoutine(data.routine)
      return { success: true, routine: data.routine }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLatestRoutine = async () => {
    try {
      setIsLoading(true)
      const data: any = await apiService.getLatestRoutine()
      setCurrentRoutine(data.routine)
      return data.routine
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTodayRoutine = async () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    try {
      setIsLoading(true)
      const data: any = await apiService.getDayRoutine(today)
      setTodayRoutine(data.day)
      return data.day
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    routine: currentRoutine,
    currentRoutine,
    todayRoutine,
    isLoading,
    error,
    generateRoutine,
    fetchLatestRoutine,
    fetchTodayRoutine,
  }
}
