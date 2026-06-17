import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DAY_LABELS } from "@/lib/days"
import { apiService } from "@/lib/services/api.service"
import type { CompletedWorkoutSummary } from "@/lib/types"
import { CheckCircle2, Clock, Dumbbell, Flame, ListChecks, Loader2, Save } from "lucide-react"

const DIFFICULTY_OPTIONS = [
  { value: "1", label: "Muy fácil" },
  { value: "2", label: "Fácil" },
  { value: "3", label: "Moderado" },
  { value: "4", label: "Difícil" },
  { value: "5", label: "Muy difícil" },
]

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export default function WorkoutCompletePage() {
  const navigate = useNavigate()
  const hasSubmitted = useRef(false)
  const [difficultyRating, setDifficultyRating] = useState<string>("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const summary = useMemo<CompletedWorkoutSummary | null>(() => {
    const storedSummary = sessionStorage.getItem("lastWorkoutSummary")
    if (!storedSummary) return null

    try {
      const parsedSummary = JSON.parse(storedSummary) as Partial<CompletedWorkoutSummary>

      if (!parsedSummary.routineId || !parsedSummary.dayId) return null

      return parsedSummary as CompletedWorkoutSummary
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!summary) {
      navigate("/workout")
    }
  }, [summary, navigate])

  const handleSaveWorkout = async () => {
    if (!summary || hasSubmitted.current || !difficultyRating) return

    hasSubmitted.current = true
    setSaveStatus("saving")
    setSaveError(null)

    try {
      await apiService.workouts.createSession({
        routineId: summary.routineId,
        dayId: summary.dayId,
        performedAt: summary.completedAt,
        totalSeconds: summary.totalSeconds,
        completedExercises: summary.completedExercises,
        completedSets: summary.completedSets,
        estimatedCalories: summary.estimatedCalories,
        difficultyRating: Number(difficultyRating),
      })

      setSaveStatus("saved")
      sessionStorage.removeItem("lastWorkoutSummary")
    } catch (error: any) {
      hasSubmitted.current = false
      setSaveStatus("error")
      setSaveError(error.message || "No se pudo guardar la sesión de entrenamiento.")
    }
  }

  if (!summary) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Entrenamiento completado</h1>
          <p className="text-muted-foreground">
            {DAY_LABELS[summary.dayOfWeek]} · {summary.focus}
          </p>
          <div className="mt-4">
            {saveStatus === "idle" && <Badge variant="secondary">Pendiente de guardar</Badge>}
            {saveStatus === "saving" && (
              <Badge variant="secondary" className="gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Guardando sesión
              </Badge>
            )}
            {saveStatus === "saved" && (
              <Badge className="bg-green-600 hover:bg-green-600">
                Sesión guardada
              </Badge>
            )}
            {saveStatus === "error" && <Badge variant="destructive">Error al guardar</Badge>}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {saveStatus === "error" && saveError && (
              <Alert variant="destructive">
                <AlertTitle>No se pudo guardar la sesión</AlertTitle>
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Tiempo total</span>
                </div>
                <p className="text-2xl font-bold">{formatDuration(summary.totalSeconds)}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Dumbbell className="h-4 w-4" />
                  <span className="text-sm">Ejercicios completados</span>
                </div>
                <p className="text-2xl font-bold">{summary.completedExercises}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <ListChecks className="h-4 w-4" />
                  <span className="text-sm">Series completadas</span>
                </div>
                <p className="text-2xl font-bold">{summary.completedSets}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm">Calorías estimadas</span>
                </div>
                <p className="text-2xl font-bold">{summary.estimatedCalories}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-4">
                <h3 className="font-semibold">¿Qué tan difícil fue este entrenamiento?</h3>
                <p className="text-sm text-muted-foreground">
                  Esta señal ayudará a ajustar futuras rutinas con IA.
                </p>
              </div>

              <RadioGroup
                value={difficultyRating}
                onValueChange={setDifficultyRating}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className="grid gap-3 sm:grid-cols-5"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`difficulty-${option.value}`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
                  >
                    <RadioGroupItem id={`difficulty-${option.value}`} value={option.value} />
                    <span>
                      <span className="block font-semibold">{option.value}</span>
                      <span className="text-muted-foreground">{option.label}</span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" asChild>
                <Link to="/workout">Ver rutina</Link>
              </Button>
              {saveStatus === "saved" ? (
                <Button asChild>
                  <Link to="/dashboard">Finalizar entrenamiento</Link>
                </Button>
              ) : (
                <Button onClick={handleSaveWorkout} disabled={!difficultyRating || saveStatus === "saving"}>
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar entrenamiento
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
