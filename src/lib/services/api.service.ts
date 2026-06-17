// API Service - All HTTP calls
import type {
  CreateProgressEntryInput,
  CreateProgressResponse,
  CreateWorkoutSessionInput,
  Profile,
  ProgressHistoryResponse,
  ProgressLatestResponse,
  Routine,
  RoutineDetailResponse,
  RoutineHistoryResponse,
  User,
  WorkoutSessionRecord,
  WorkoutSummaryStats,
} from "@/lib/types"

const API_BASE_URL = import.meta.env.VITE_API_URL

export class ApiServiceError extends Error {
  statusCode?: number
  code?: string

  constructor(message: string, statusCode?: number, code?: string) {
    super(message)
    this.name = "ApiServiceError"
    this.statusCode = statusCode
    this.code = code
  }
}

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

interface WorkoutSessionResponse {
  session: WorkoutSessionRecord
}

interface WorkoutHistoryResponse {
  sessions: WorkoutSessionRecord[]
}

class ApiService {
  workouts = {
    createSession: (data: CreateWorkoutSessionInput): Promise<WorkoutSessionResponse> =>
      this.request<WorkoutSessionResponse>("/workouts/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getSummary: (): Promise<WorkoutSummaryStats> => this.request<WorkoutSummaryStats>("/workouts/summary"),
    getHistory: (): Promise<WorkoutHistoryResponse> => this.request<WorkoutHistoryResponse>("/workouts/history"),
  }

  progress = {
    create: (data: CreateProgressEntryInput): Promise<CreateProgressResponse> =>
      this.request<CreateProgressResponse>("/progress", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getHistory: (): Promise<ProgressHistoryResponse> => this.request<ProgressHistoryResponse>("/progress/history"),
    getLatest: (): Promise<ProgressLatestResponse> => this.request<ProgressLatestResponse>("/progress/latest"),
  }

  routines = {
    getHistory: (): Promise<RoutineHistoryResponse> => this.request<RoutineHistoryResponse>("/routines/history"),
    getById: (id: string): Promise<RoutineDetailResponse> => this.request<RoutineDetailResponse>(`/routines/${id}`),
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!API_BASE_URL) {
      throw new ApiServiceError(
        "Falta configurar VITE_API_URL. Define la URL del backend en el archivo .env.",
        undefined,
        "missing_api_url",
      )
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

    let response: Response

    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    } catch {
      throw new ApiServiceError(
        "No se pudo conectar con el backend. Verifica que el servidor esté encendido.",
        undefined,
        "network_error",
      )
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: "Request failed",
      }))

      if (response.status === 401 && endpoint !== "/auth/login" && endpoint !== "/auth/register") {
        window.dispatchEvent(new Event("auth:unauthorized"))
      }

      throw new ApiServiceError(
        this.normalizeErrorMessage(error.message, response.status, endpoint),
        response.status,
        this.getErrorCode(error.message, response.status),
      )
    }

    return response.json()
  }

  private normalizeErrorMessage(message: string, status: number, endpoint: string) {
    const normalized = message?.toLowerCase() || ""

    if (status === 401) return "Tu sesión expiró. Inicia sesión nuevamente."
    if (status === 409 || normalized.includes("already") || normalized.includes("existe")) {
      return "Este email ya está registrado."
    }
    if (normalized.includes("cohere")) return "Cohere no pudo generar la rutina en este momento."
    if (status >= 500) return "El backend tuvo un error interno. Intenta nuevamente."
    if (endpoint === "/routines/generate" && status === 400) return "Completa tu perfil antes de generar una rutina."

    return message || `La solicitud falló con estado ${status}`
  }

  private getErrorCode(message: string, status: number) {
    const normalized = message?.toLowerCase() || ""

    if (status === 401) return "token_expired"
    if (status === 409 || normalized.includes("already") || normalized.includes("existe")) return "email_exists"
    if (normalized.includes("cohere")) return "cohere_error"
    if (status >= 500) return "server_error"

    return "request_error"
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
    return this.progress.create(data)
  }

  async getProgressSummary() {
    return this.progress.getLatest()
  }
}

export const apiService = new ApiService()
