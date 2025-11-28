import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

// Pages
import HomePage from '@/pages/Home'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import OnboardingPage from '@/pages/Onboarding'
import DashboardPage from '@/pages/Dashboard'
import ProfilePage from '@/pages/Profile'
import GeneratePage from '@/pages/Generate'
import WorkoutPage from '@/pages/workout/Workout'
import WorkoutPlayerPage from '@/pages/workout/WorkoutPlayer'
import NutritionPage from '@/pages/Nutrition'

function App() {
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
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/workout/player" element={<WorkoutPlayerPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

