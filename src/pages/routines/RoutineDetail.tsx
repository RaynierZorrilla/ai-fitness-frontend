import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { DAY_LABELS } from "@/lib/days"
import { apiService } from "@/lib/services/api.service"
import type { FitnessGoal, RoutineDetailResponse } from "@/lib/types"
import { ChevronLeft, Loader2, Play } from "lucide-react"

const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_fat: "Perder grasa",
  gain_muscle: "Ganar músculo",
  maintenance: "Mantenimiento",
  recomposition: "Recomposición",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default function RoutineDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [routine, setRoutine] = useState<RoutineDetailResponse["routine"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user || !id) return

    apiService.routines
      .getById(id)
      .then((response) => {
        setRoutine(response.routine)
        setError(null)
      })
      .catch((requestError: Error) => {
        setError(requestError.message || "No se pudo cargar el detalle de la rutina.")
      })
      .finally(() => setIsLoading(false))
  }, [user, id])

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
          <Link to="/routines/history">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cargar la rutina</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && routine && (
          <>
            <div className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {routine.isActive ? (
                  <Badge className="bg-green-600 hover:bg-green-600">Actual</Badge>
                ) : (
                  <Badge variant="outline">Anterior</Badge>
                )}
                <Badge variant="secondary">{GOAL_LABELS[routine.goal]}</Badge>
                <Badge variant="outline">{formatDate(routine.createdAt)}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{routine.title}</h1>
              <p className="text-muted-foreground">{routine.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Días</p>
                  <p className="text-2xl font-bold">{routine.dayCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Ejercicios</p>
                  <p className="text-2xl font-bold">{routine.exerciseCount}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {routine.days.map((dayRoutine, index) => (
                <Card key={dayRoutine.id || index}>
                  <CardHeader className="bg-muted/30">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-xl">{DAY_LABELS[dayRoutine.dayOfWeek]}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{dayRoutine.focus}</p>
                      </div>
                      {routine.isActive && (
                        <Button asChild>
                          <Link to={`/workout/player?day=${dayRoutine.dayOfWeek}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Iniciar
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {dayRoutine.exercises.map((exercise, exerciseIndex) => (
                        <div key={`${exercise.name}-${exerciseIndex}`} className="border-b pb-4 last:border-0">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets} series x {exercise.reps} reps · {exercise.restSeconds}s descanso
                              </p>
                            </div>
                            <Badge variant="outline" className="capitalize">{exercise.intensity}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{exercise.muscleGroup}</Badge>
                            <Badge variant="secondary">{exercise.equipment}</Badge>
                          </div>
                          {exercise.notes && <p className="mt-2 text-sm text-muted-foreground">{exercise.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
