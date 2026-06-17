import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { apiService } from "@/lib/services/api.service"
import type { WorkoutSessionRecord } from "@/lib/types"
import { CalendarDays, ChevronLeft, Clock, Dumbbell, Flame, Loader2 } from "lucide-react"

function formatMinutes(seconds: number) {
  return `${Math.round(seconds / 60)} min`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export default function WorkoutHistoryPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<WorkoutSessionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiService.workouts
      .getHistory()
      .then((response) => {
        setSessions(response.sessions)
        setError(null)
      })
      .catch((requestError: Error) => {
        setError(requestError.message || "No se pudo cargar el historial.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historial de entrenamientos</h1>
        </div>

        {isLoading && (
          <div className="min-h-[45vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cargar el historial</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <Empty className="min-h-[45vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no hay sesiones guardadas</EmptyTitle>
              <EmptyDescription>Completa un entrenamiento para verlo en tu historial.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/workout">Ver rutina</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{formatDate(session.performedAt)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {formatMinutes(session.totalSeconds)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Dumbbell className="h-4 w-4 text-orange-500" />
                      {session.completedExercises} ejercicios
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-green-500" />
                      {session.completedSets} series
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-red-500" />
                      {session.estimatedCalories} cal
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
