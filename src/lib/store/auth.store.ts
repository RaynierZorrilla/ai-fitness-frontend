// Auth Store with Zustand
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => {
        localStorage.setItem("authToken", token)
        set({ token })
      },
      logout: () => {
        localStorage.removeItem("authToken")
        set({ user: null, token: null, isAuthenticated: false })
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
