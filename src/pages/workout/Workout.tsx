import { useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { useProfile } from "@/hooks/use-profile"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ProfileIncompleteModal } from "@/components/profile-incomplete-modal"
import { isProfileComplete } from "@/lib/utils"
import { DAY_LABELS } from "@/lib/days"
import { apiService } from "@/lib/services/api.service"
import type { FitnessOverviewResponse, RoutineAdjustmentAnalysis } from "@/lib/types"
import { Play, ChevronLeft, Sparkles, Loader2, WandSparkles } from "lucide-react"
import { toast } from "sonner"

export default function WorkoutPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { routine, isLoading, fetchCurrentRoutine, adjustRoutine } = useRoutine()
  const { profile, isLoading: profileLoading } = useProfile()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [adjustmentAnalysis, setAdjustmentAnalysis] = useState<RoutineAdjustmentAnalysis | null>(null)
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null)
  const [fitnessOverview, setFitnessOverview] = useState<FitnessOverviewResponse | null>(null)
  const routineListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchCurrentRoutine()
      apiService.analytics
        .getFitnessOverview()
        .then((overview) => setFitnessOverview(overview))
        .catch(() => setFitnessOverview(null))
    }
  }, [user])

  // Verificar si el perfil está completo cuando se carga la página
  useEffect(() => {
    if (!profileLoading && profile && !isProfileComplete(profile)) {
      setShowProfileModal(true)
    }
  }, [profile, profileLoading])

  const handleAdjustRoutine = async () => {
    setAdjustmentAnalysis(null)
    setAdjustmentError(null)

    const result = await adjustRoutine()

    if (result.success && result.analysis) {
      setAdjustmentAnalysis(result.analysis)
      toast.success("Rutina ajustada correctamente")
      navigate("/workout", { replace: true })
    } else {
      setAdjustmentError(result.error || "No se pudo ajustar la rutina.")
      toast.error(result.error || "No se pudo ajustar la rutina.")
    }
  }

  const handleViewAdjustedRoutine = () => {
    routineListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (authLoading || profileLoading || (isLoading && !routine)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando rutina...</p>
      </div>
    )
  }


  if (!user) return null

  if (!routine && profile && !isProfileComplete(profile)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <AppHeader />
        <div className="container px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <ProfileIncompleteModal
              open={showProfileModal}
              onOpenChange={setShowProfileModal}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <AppHeader />
        <div className="container px-4 py-8 max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>

          <Empty className="min-h-[55vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Sparkles className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no tienes una rutina generada.</EmptyTitle>
              <EmptyDescription>
                Genera tu primera rutina personalizada para ver tus entrenamientos semanales.
              </EmptyDescription>
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ProfileIncompleteModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
      <AppHeader />
      <div className="container px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tu Rutina Semanal</h1>
          <p className="text-muted-foreground">Plan de entrenamiento personalizado</p>
        </div>

        <Card className="mb-6 border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-600/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-orange-500" />
              Ajuste inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">¿Tu rutina se siente muy fácil o demasiado fuerte?</p>
                <p className="text-sm text-muted-foreground">
                  La IA revisa tu progreso, fatiga y sesiones recientes para crear una versión ajustada.
                </p>
              </div>
              <Button onClick={handleAdjustRoutine} disabled={isLoading} className="bg-gradient-to-r from-orange-500 to-red-600">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando ajuste...
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Ajustar con IA
                  </>
                )}
              </Button>
            </div>

            {adjustmentError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600">
                {adjustmentError}
              </div>
            )}

            {adjustmentAnalysis && (
              <div className="rounded-lg border bg-background/70 p-4">
                <h3 className="mb-3 font-semibold">Análisis IA</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Resumen</p>
                    <p>{adjustmentAnalysis.summary}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Progreso</p>
                      <p className="font-medium">{adjustmentAnalysis.progressStatus}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Fatiga</p>
                      <p className="font-medium">{adjustmentAnalysis.fatigueLevel}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Ajuste recomendado</p>
                      <p className="font-medium">{adjustmentAnalysis.recommendedAdjustment}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <p className="mb-3 font-medium">¿Por qué se ajustó la rutina?</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Adherencia: {adjustmentAnalysis.adherencePercentage ?? fitnessOverview?.adherencePercentage ?? "Sin dato"}%</li>
                    <li>
                      • Dificultad promedio:{" "}
                      {adjustmentAnalysis.averageDifficulty ?? fitnessOverview?.averageDifficulty ?? "Sin dato"}
                    </li>
                    <li>• Fatiga detectada: {adjustmentAnalysis.fatigueLevel}</li>
                    <li>
                      • Cambio de peso:{" "}
                      {adjustmentAnalysis.weightChangeKg ?? fitnessOverview?.weightChangeKg ?? "Sin dato"} kg
                    </li>
                  </ul>
                  <p className="mt-3 text-sm">
                    La IA aplicó el ajuste recomendado: {adjustmentAnalysis.recommendedAdjustment}.
                  </p>
                </div>
                <Button className="mt-4" onClick={handleViewAdjustedRoutine}>
                  Ver rutina ajustada
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div ref={routineListRef} className="scroll-mt-24 space-y-4">
          {routine.days.map((dayRoutine, index) => (
            <Card key={dayRoutine.id || index} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{DAY_LABELS[dayRoutine.dayOfWeek]}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{dayRoutine.focus}</p>
                  </div>
                  <Badge variant="secondary">{dayRoutine.exercises.length} ejercicios</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {dayRoutine.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 font-semibold text-sm flex-shrink-0">
                        {exIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                          <span>
                            {exercise.sets} series × {exercise.reps} reps
                          </span>
                          <span>•</span>
                          <span>{exercise.restSeconds}s descanso</span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {exercise.muscleGroup}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exercise.equipment}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {exercise.intensity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" size="lg" asChild>
                  <Link to={`/workout/player?day=${dayRoutine.dayOfWeek}`}>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Entrenamiento
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
