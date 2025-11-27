import { useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth.store"
import { apiService } from "@/lib/services/api.service"

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setUser, setToken, logout, setLoading } = useAuthStore()

  useEffect(() => {
    // Verify token on mount
    if (token && !user) {
      verifyAuth()
    }
  }, [token, user])

  const verifyAuth = async () => {
    try {
      setLoading(true)
      const data: any = await apiService.getMe()
      setUser(data.user)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response: any = await apiService.login(email, password)
      setToken(response.token)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const response: any = await apiService.register(email, password, name)
      setToken(response.token)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }
}
