import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { Dumbbell, Apple, TrendingUp, Calendar, Play, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { routine, fetchCurrentRoutine } = useRoutine()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchCurrentRoutine()
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const todayWorkout = routine?.days?.find((dayRoutine) => dayRoutine.dayOfWeek.toLowerCase() === today)

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fondo degradado - cambia según el tema */}
      <div className="fixed inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 via-white to-slate-100 -z-10" />
      
      <AppHeader />
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white text-slate-900">Hola, {user.name}!</h1>
          <p className="dark:text-white/70 text-slate-700">Aquí está tu resumen de hoy</p>
        </div>

        {/* Today's Workout */}
        {todayWorkout && (
          <div className="glass-strong rounded-2xl p-6 mb-6 border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <h2 className="text-xl font-semibold dark:text-white text-slate-900">Entrenamiento de Hoy</h2>
                </div>
                <p className="text-base font-medium dark:text-white/80 text-slate-700">{todayWorkout.focus}</p>
              </div>
              <Link
                to="/workout"
                className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Comenzar
              </Link>
            </div>
            <p className="text-sm dark:text-white/60 text-slate-600">{todayWorkout.exercises.length} ejercicios programados</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Entrenamientos</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">32</p>
                </div>
              </div>
              <div className="text-xs text-orange-500 font-medium">Este mes</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Calorías</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">2,500</p>
                </div>
              </div>
              <div className="text-xs text-red-500 font-medium">Objetivo</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Progreso</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">-2 kg</p>
                </div>
              </div>
              <div className="text-xs text-green-500 font-medium">30 días</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/routine"
            className="glass-card rounded-xl p-6 hover:glass-strong transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Ver Rutina Completa</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Revisa tu plan de entrenamiento semanal</p>
          </Link>

          <Link
            to="/nutrition"
            className="glass-card rounded-xl p-6 hover:glass-strong transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <Apple className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Plan Nutricional</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Consulta tus comidas y macros del día</p>
          </Link>

          <Link
            to="/progress"
            className="glass-card rounded-xl p-6 hover:glass-strong transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Seguimiento</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Visualiza tu evolución y estadísticas</p>
          </Link>

          <Link
            to="/generate"
            className="glass-card rounded-xl p-6 hover:glass-strong transition-all cursor-pointer border-2 border-orange-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Generar Nueva Rutina</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Crea un plan personalizado con IA</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

