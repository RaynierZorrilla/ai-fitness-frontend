import { useState } from "react"
import { apiService } from "@/lib/services/api.service"
import type { MealPlan, MealPlanHistoryItem } from "@/lib/types"

export function useNutrition() {
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null)
  const [mealPlans, setMealPlans] = useState<MealPlanHistoryItem[]>([])
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrent = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.nutrition.getCurrent()
      setCurrentMealPlan(response.mealPlan)
      return response.mealPlan
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo cargar el plan nutricional."
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.nutrition.getHistory()
      const plans = Array.isArray(response.mealPlans) ? response.mealPlans : []
      setMealPlans(plans)
      return plans
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo cargar el historial nutricional."
      setError(message)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const fetchById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.nutrition.getById(id)
      setSelectedMealPlan(response.mealPlan)
      return response.mealPlan
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo cargar el detalle del plan nutricional."
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generate = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      const response = await apiService.nutrition.generate()
      setCurrentMealPlan(response.mealPlan)
      return { success: true, mealPlan: response.mealPlan }
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo generar el plan nutricional."
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    currentMealPlan,
    mealPlans,
    selectedMealPlan,
    isLoading,
    isGenerating,
    error,
    fetchCurrent,
    fetchHistory,
    fetchById,
    generate,
  }
}
