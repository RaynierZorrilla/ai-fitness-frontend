import { useState } from "react"
import { apiService } from "@/lib/services/api.service"
import type { CreateProgressEntryInput, ProgressEntry } from "@/lib/types"

export function useProgress() {
  const [latestEntry, setLatestEntry] = useState<ProgressEntry | null>(null)
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLatest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.progress.getLatest()
      setLatestEntry(response.entry)
      return response.entry
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo cargar el último progreso."
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
      const response = await apiService.progress.getHistory()
      setEntries(response.entries)
      return response.entries
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo cargar el historial de progreso."
      setError(message)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const createEntry = async (data: CreateProgressEntryInput) => {
    try {
      setIsSaving(true)
      setError(null)
      const response = await apiService.progress.create(data)
      setLatestEntry(response.entry)
      setEntries((currentEntries) => [response.entry, ...currentEntries])
      return { success: true, entry: response.entry }
    } catch (requestError: any) {
      const message = requestError.message || "No se pudo guardar el progreso."
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    latestEntry,
    entries,
    isLoading,
    isSaving,
    error,
    fetchLatest,
    fetchHistory,
    createEntry,
  }
}
