// API Service - All HTTP calls
import type { User, Profile, Routine } from "@/lib/types"

const API_BASE_URL = import.meta.env.VITE_API_URL

interface ApiError {
  statusCode: number
  message: string
}

interface AuthResponse {
  user: User
  token: string
}

interface ProfileResponse {
  profile: Profile
}

interface RoutineResponse {
  routine: Routine | null
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("authToken")

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: "Request failed",
      }))
      throw new Error(error.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, ...(name && { name }) }),
    })
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me")
  }

  // Profile
  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>("/profile")
  }

  async updateProfile(data: Partial<Profile>): Promise<ProfileResponse> {
    return this.request<ProfileResponse>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Routine
  async generateRoutine(): Promise<RoutineResponse> {
    // El backend usa el perfil del usuario autenticado, no requiere body
    return this.request<RoutineResponse>("/routines/generate", {
      method: "POST",
      body: JSON.stringify({}),
    })
  }

  async getCurrentRoutine(): Promise<RoutineResponse> {
    return this.request<RoutineResponse>("/routines/current")
  }

  // Nutrition
  async generateNutrition(profileData: any) {
    return this.request("/nutrition/generate", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  }

  async getTodayNutrition() {
    return this.request("/nutrition/today")
  }

  // Progress
  async addMeasurement(data: any) {
    return this.request("/progress/measurements", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getProgressSummary() {
    return this.request("/progress/summary")
  }
}

export const apiService = new ApiService()
