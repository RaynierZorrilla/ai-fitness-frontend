import { useState } from "react"
import { useWorkoutStore } from "@/lib/store/workout.store"
import { apiService } from "@/lib/services/api.service"
import type { Routine, RoutineDay } from "@/lib/types"

export function useRoutine() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentRoutine, setCurrentRoutine, todayRoutine, setTodayRoutine } = useWorkoutStore()

  const generateRoutine = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.generateRoutine()
      if (data.routine) {
        setCurrentRoutine(data.routine)
        return { success: true, routine: data.routine }
      } else {
        throw new Error("No se pudo generar la rutina")
      }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCurrentRoutine = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.getCurrentRoutine()
      if (data.routine) {
        setCurrentRoutine(data.routine)
        return data.routine
      }
      return null
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getTodayRoutine = (routine: Routine | null): RoutineDay | null => {
    if (!routine) return null
    
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const dayRoutine = routine.days.find(
      (day) => day.dayOfWeek.toLowerCase() === today
    )
    
    if (dayRoutine) {
      setTodayRoutine(dayRoutine)
      return dayRoutine
    }
    
    return null
  }

  return {
    routine: currentRoutine,
    currentRoutine,
    todayRoutine,
    isLoading,
    error,
    generateRoutine,
    fetchCurrentRoutine,
    getTodayRoutine,
  }
}
