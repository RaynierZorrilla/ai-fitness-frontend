import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage from '@/pages/Home'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import DashboardPage from '@/pages/Dashboard'
import WorkoutPage from '@/pages/workout/Workout'
import WorkoutPlayerPage from '@/pages/workout/WorkoutPlayer'
import NutritionPage from '@/pages/Nutrition'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/workout" element={<WorkoutPage />} />
      <Route path="/workout/player" element={<WorkoutPlayerPage />} />
      <Route path="/nutrition" element={<NutritionPage />} />
    </Routes>
  )
}

export default App

