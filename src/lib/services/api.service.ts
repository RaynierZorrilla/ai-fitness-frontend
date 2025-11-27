// API Service - All HTTP calls
import { mockUser, mockRoutine, mockNutritionPlan, mockProgress } from "./mock-data"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"
const USE_MOCK = !import.meta.env.VITE_API_URL // Usar mock si no hay URL de backend

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return this.getMockResponse(endpoint, options.method || "GET") as T
    }

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
      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  private getMockResponse(endpoint: string, method: string): any {
    console.log("[v0] Mock API call:", method, endpoint)

    // Auth endpoints
    if (endpoint === "/auth/login" && method === "POST") {
      localStorage.setItem("authToken", "mock-token-123")
      return { user: mockUser, token: "mock-token-123" }
    }
    if (endpoint === "/auth/register" && method === "POST") {
      localStorage.setItem("authToken", "mock-token-123")
      return { user: mockUser, token: "mock-token-123" }
    }
    if (endpoint === "/auth/me") {
      return { user: mockUser }
    }

    // Profile endpoints
    if (endpoint === "/profile") {
      if (method === "PUT") {
        return { success: true, profile: mockUser.profile }
      }
      return { profile: mockUser.profile }
    }

    // Routine endpoints
    if (endpoint === "/routine/generate" && method === "POST") {
      return { routine: mockRoutine }
    }
    if (endpoint === "/routine/latest") {
      return { routine: mockRoutine }
    }
    if (endpoint.startsWith("/routine/day/")) {
      const day = endpoint.split("/").pop()
      const dayData = mockRoutine.weekPlan.find((d) => d.day.toLowerCase() === day?.toLowerCase())
      return { day: dayData }
    }
    if (endpoint === "/routine/progress" && method === "POST") {
      return { success: true }
    }

    // Nutrition endpoints
    if (endpoint === "/nutrition/generate" && method === "POST") {
      return { nutrition: mockNutritionPlan }
    }
    if (endpoint === "/nutrition/today") {
      return { nutrition: mockNutritionPlan }
    }

    // Progress endpoints
    if (endpoint === "/progress/measurements" && method === "POST") {
      return { success: true }
    }
    if (endpoint === "/progress/summary") {
      return { progress: mockProgress }
    }

    return { error: "Mock endpoint not found" }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  async getMe() {
    return this.request("/auth/me")
  }

  // Profile
  async getProfile() {
    return this.request("/profile")
  }

  async updateProfile(data: any) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Routine
  async generateRoutine(profileData: any) {
    return this.request("/routine/generate", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  }

  async getLatestRoutine() {
    return this.request("/routine/latest")
  }

  async getDayRoutine(day: string) {
    return this.request(`/routine/day/${day}`)
  }

  async logProgress(exerciseData: any) {
    return this.request("/routine/progress", {
      method: "POST",
      body: JSON.stringify(exerciseData),
    })
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
