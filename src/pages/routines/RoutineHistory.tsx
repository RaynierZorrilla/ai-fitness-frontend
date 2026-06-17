import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/services/api.service"
import type { FitnessGoal, RoutineHistoryItem } from "@/lib/types"
import { CalendarDays, ChevronLeft, Dumbbell, Eye, Loader2, Sparkles } from "lucide-react"

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

function RoutineCard({ routine }: { routine: RoutineHistoryItem }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{routine.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{routine.description}</p>
          </div>
          {routine.isActive && <Badge className="w-fit bg-green-600 hover:bg-green-600">Actual</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="font-medium">{formatDate(routine.createdAt)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Objetivo</p>
            <p className="font-medium">{GOAL_LABELS[routine.goal]}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Días</p>
            <p className="font-medium">{routine.dayCount}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Ejercicios</p>
            <p className="font-medium">{routine.exerciseCount}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button asChild variant="outline">
            <Link to={`/routines/${routine.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoutineHistoryPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const [routines, setRoutines] = useState<RoutineHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return

    apiService.routines
      .getHistory()
      .then((response) => {
        setRoutines(response.routines)
        setError(null)
      })
      .catch((requestError: Error) => {
        setError(requestError.message || "No se pudo cargar el historial de rutinas.")
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

  const currentRoutine = routines.find((routine) => routine.isActive)
  const previousRoutines = routines.filter((routine) => !routine.isActive)

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
          <h1 className="text-3xl font-bold mb-2">Historial de rutinas</h1>
          <p className="text-muted-foreground">Consulta tu rutina actual y planes anteriores</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>No se pudo cargar el historial</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && routines.length === 0 && (
          <Empty className="min-h-[50vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Dumbbell className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no tienes rutinas</EmptyTitle>
              <EmptyDescription>Genera tu primera rutina para empezar tu historial.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/generate">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar rutina
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!error && routines.length > 0 && (
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Rutina actual</h2>
              </div>
              {currentRoutine ? (
                <RoutineCard routine={currentRoutine} />
              ) : (
                <Card>
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    No hay una rutina activa en este momento.
                  </CardContent>
                </Card>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Rutinas anteriores</h2>
              </div>
              {previousRoutines.length > 0 ? (
                <div className="space-y-4">
                  {previousRoutines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    Aún no hay rutinas anteriores.
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
