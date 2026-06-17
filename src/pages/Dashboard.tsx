import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { DAY_LABELS, getTodayDayOfWeek } from "@/lib/days"
import { apiService } from "@/lib/services/api.service"
import type { ProgressEntry, WorkoutSummaryStats } from "@/lib/types"
import { Dumbbell, Apple, TrendingUp, Calendar, Play, Sparkles, Clock, Scale, Ruler } from "lucide-react"

const emptyWorkoutSummary: WorkoutSummaryStats = {
  totalSessions: 0,
  currentWeekSessions: 0,
  totalCalories: 0,
  totalWorkoutTimeMinutes: 0,
}

function formatProgressDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
  }).format(new Date(value))
}

function formatDashboardWeight(weightKg: number | null) {
  if (weightKg === null) return "Sin dato"

  return `${(weightKg * 2.20462).toFixed(1)} lb / ${weightKg.toFixed(1)} kg`
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { routine, fetchCurrentRoutine } = useRoutine()
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummaryStats>(emptyWorkoutSummary)
  const [latestProgress, setLatestProgress] = useState<ProgressEntry | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [progressError, setProgressError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchCurrentRoutine()
      apiService.workouts
        .getSummary()
        .then((summary) => {
          setWorkoutSummary(summary)
          setSummaryError(null)
        })
        .catch((error: Error) => {
          setWorkoutSummary(emptyWorkoutSummary)
          setSummaryError(error.message || "No se pudieron cargar las métricas.")
        })
      apiService.progress
        .getLatest()
        .then((response) => {
          setLatestProgress(response.entry)
          setProgressError(null)
        })
        .catch((error: Error) => {
          setLatestProgress(null)
          setProgressError(error.message || "No se pudo cargar el último progreso.")
        })
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

  const today = getTodayDayOfWeek()
  const todayWorkout = routine?.days?.find((dayRoutine) => dayRoutine.dayOfWeek === today)

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
                to={`/workout/player?day=${todayWorkout.dayOfWeek}`}
                className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Comenzar
              </Link>
            </div>
            <p className="text-sm dark:text-white/60 text-slate-600">
              {DAY_LABELS[todayWorkout.dayOfWeek]} · {todayWorkout.exercises.length} ejercicios programados
            </p>
          </div>
        )}

        {/* Quick Stats */}
        {summaryError && (
          <div className="glass-card rounded-xl p-4 mb-6 border-red-500/30">
            <p className="text-sm text-red-500">{summaryError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Sesiones</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">{workoutSummary.totalSessions}</p>
                </div>
              </div>
              <div className="text-xs text-orange-500 font-medium">Total</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Esta semana</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">{workoutSummary.currentWeekSessions}</p>
                </div>
              </div>
              <div className="text-xs text-red-500 font-medium">Sesiones</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Calorías</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">{workoutSummary.totalCalories}</p>
                </div>
              </div>
              <div className="text-xs text-green-500 font-medium">Acumuladas</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm dark:text-white/60 text-slate-600">Tiempo</p>
                  <p className="text-2xl font-bold dark:text-white text-slate-900">
                    {workoutSummary.totalWorkoutTimeMinutes}m
                  </p>
                </div>
              </div>
              <div className="text-xs text-blue-500 font-medium">Total</div>
            </div>
          </div>
        </div>

        {progressError && (
          <div className="glass-card rounded-xl p-4 mb-6 border-red-500/30">
            <p className="text-sm text-red-500">{progressError}</p>
          </div>
        )}

        <div className="glass-strong rounded-2xl p-6 mb-6 border-green-500/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold dark:text-white text-slate-900">Último progreso</h2>
              </div>
              {latestProgress ? (
                <div className="grid sm:grid-cols-3 gap-3 text-sm dark:text-white/70 text-slate-700">
                  <span className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-green-500" />
                    Peso: {formatDashboardWeight(latestProgress.weightKg)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-blue-500" />
                    Cintura: {latestProgress.waistCm !== null ? `${latestProgress.waistCm} cm` : "Sin dato"}
                  </span>
                  <span>Registrado: {formatProgressDate(latestProgress.recordedAt)}</span>
                </div>
              ) : (
                <p className="text-sm dark:text-white/60 text-slate-600">
                  Aún no tienes registros de progreso.
                </p>
              )}
            </div>
            <Link
              to="/progress"
              className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-2 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all text-center"
            >
              Ver progreso
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/routines/history"
            className="glass-card rounded-xl p-6 hover:glass-strong transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Historial de Rutinas</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Revisa tu rutina actual y planes anteriores</p>
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
              <h3 className="text-lg font-semibold dark:text-white text-slate-900">Progreso</h3>
            </div>
            <p className="dark:text-white/70 text-slate-700 text-sm">Registra y revisa tus medidas corporales</p>
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
