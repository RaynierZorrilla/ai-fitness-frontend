import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/services/api.service"
import type { FitnessOverviewResponse, WorkoutSummaryStats } from "@/lib/types"
import { Activity, ChevronLeft, Dumbbell, Loader2, Ruler, Scale, Star, Target } from "lucide-react"

const emptyWorkoutSummary: WorkoutSummaryStats = {
  totalSessions: 0,
  currentWeekSessions: 0,
  totalCalories: 0,
  totalWorkoutTimeMinutes: 0,
}

function formatValue(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined) return "Sin dato"
  return `${value.toFixed(1)}${suffix}`
}

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const [overview, setOverview] = useState<FitnessOverviewResponse | null>(null)
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummaryStats>(emptyWorkoutSummary)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return

    Promise.allSettled([apiService.analytics.getFitnessOverview(), apiService.workouts.getSummary()])
      .then(([overviewResult, summaryResult]) => {
        if (overviewResult.status === "fulfilled") {
          setOverview(overviewResult.value)
          setError(null)
        } else {
          setError(overviewResult.reason?.message || "No se pudo cargar el overview de fitness.")
        }

        if (summaryResult.status === "fulfilled") {
          setWorkoutSummary(summaryResult.value)
        } else {
          setWorkoutSummary(emptyWorkoutSummary)
        }
      })
      .finally(() => setIsLoading(false))
  }, [user])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Resumen inteligente de entrenamiento y progreso</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>No se pudo cargar analytics</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {overview && (
          <div className="grid md:grid-cols-5 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dumbbell className="h-4 w-4 text-orange-500" />
                  Total sesiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{overview.totalSessions}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Dificultad promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatValue(overview.averageDifficulty)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4 text-green-500" />
                  Cambio peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatValue(overview.weightChangeKg, " kg")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ruler className="h-4 w-4 text-blue-500" />
                  Cambio cintura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatValue(overview.waistChangeCm, " cm")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-purple-500" />
                  Adherencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatValue(overview.adherencePercentage, "%")}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {overview && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Lectura rápida
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-3">
              <p>Sesiones esta semana: {overview.currentWeekSessions ?? workoutSummary.currentWeekSessions}</p>
              <p>Tiempo entrenado: {overview.totalWorkoutTimeMinutes ?? workoutSummary.totalWorkoutTimeMinutes} min</p>
              <p>Calorías acumuladas: {overview.totalCalories ?? workoutSummary.totalCalories}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
