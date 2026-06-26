import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuthStore } from '@/lib/store/auth.store'

// Pages
import HomePage from '@/pages/Home'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import OnboardingPage from '@/pages/Onboarding'
import DashboardPage from '@/pages/Dashboard'
import ProfilePage from '@/pages/Profile'
import GeneratePage from '@/pages/Generate'
import RoutineHistoryPage from '@/pages/routines/RoutineHistory'
import RoutineDetailPage from '@/pages/routines/RoutineDetail'
import WorkoutPage from '@/pages/workout/Workout'
import WorkoutPlayerPage from '@/pages/workout/WorkoutPlayer'
import WorkoutCompletePage from '@/pages/workout/WorkoutComplete'
import WorkoutHistoryPage from '@/pages/workout/WorkoutHistory'
import NutritionPage from '@/pages/Nutrition'
import NutritionHistoryPage from '@/pages/nutrition/NutritionHistory'
import NutritionDetailPage from '@/pages/nutrition/NutritionDetail'
import ProgressPage from '@/pages/Progress'
import AnalyticsPage from '@/pages/Analytics'

function App() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
      navigate('/auth/login')
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [logout, navigate])

  return (
    <ThemeProvider defaultTheme="dark">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/routines/history" element={<RoutineHistoryPage />} />
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
        <Route path="/routine" element={<WorkoutPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/workout/player" element={<WorkoutPlayerPage />} />
        <Route path="/workout/complete" element={<WorkoutCompletePage />} />
        <Route path="/workouts/history" element={<WorkoutHistoryPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/nutrition/history" element={<NutritionHistoryPage />} />
        <Route path="/nutrition/:id" element={<NutritionDetailPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
