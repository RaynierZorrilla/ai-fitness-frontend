import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { useTimer } from "@/hooks/use-timer"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { isDayOfWeek } from "@/lib/days"
import type { DayOfWeek } from "@/lib/types"
import { ChevronLeft, Play, Pause, SkipForward, Check } from "lucide-react"

export default function WorkoutPlayerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const day = searchParams.get("day")
  const { user, isLoading: authLoading } = useAuth()
  const { routine, isLoading, fetchCurrentRoutine } = useRoutine()
  const { timerSeconds, isTimerRunning, startTimer, stopTimer, resetTimer, setTimerSeconds } = useTimer()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [completedSets, setCompletedSets] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(0)
  const [hasRequestedRoutine, setHasRequestedRoutine] = useState(false)
  const [startedAt] = useState(() => Date.now())

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    let isMounted = true

    if (user) {
      setHasRequestedRoutine(false)
      fetchCurrentRoutine().finally(() => {
        if (isMounted) {
          setHasRequestedRoutine(true)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [user])

  const requestedDay = useMemo<DayOfWeek | null>(() => {
    return isDayOfWeek(day) ? (day.toLowerCase() as DayOfWeek) : null
  }, [day])

  const dayWorkout = useMemo(() => {
    if (!routine || !requestedDay) return null
    return routine.days.find((routineDay) => routineDay.dayOfWeek === requestedDay) || null
  }, [routine, requestedDay])

  useEffect(() => {
    if (authLoading || !user) return

    if (!requestedDay) {
      navigate("/workout")
      return
    }

    if (hasRequestedRoutine && (!routine || !dayWorkout || dayWorkout.exercises.length === 0)) {
      navigate("/workout")
    }
  }, [authLoading, user, hasRequestedRoutine, routine, requestedDay, dayWorkout, navigate])

  useEffect(() => {
    if (isResting && timerSeconds === 0 && !isTimerRunning) {
      setIsResting(false)
      resetTimer()
    }
  }, [isResting, timerSeconds, isTimerRunning, resetTimer])

  if (authLoading || isLoading || (user && !hasRequestedRoutine && !routine)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user || !routine || !dayWorkout) return null

  const currentExercise = dayWorkout.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / dayWorkout.exercises.length) * 100

  const handleNextSet = () => {
    setCompletedSets((sets) => sets + 1)

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1)
      setIsResting(true)
      setTimerSeconds(currentExercise.restSeconds)
      startTimer()
    } else {
      handleNextExercise(true)
    }
  }

  const handleNextExercise = (markCompleted = true) => {
    const nextCompletedExercises = completedExercises + (markCompleted ? 1 : 0)

    if (currentExerciseIndex < dayWorkout.exercises.length - 1) {
      setCompletedExercises(nextCompletedExercises)
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setIsResting(false)
      resetTimer()
    } else {
      const totalSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      const totalSets = completedSets + 1

      sessionStorage.setItem(
        "lastWorkoutSummary",
        JSON.stringify({
          routineId: routine.id,
          dayId: dayWorkout.id,
          dayOfWeek: dayWorkout.dayOfWeek,
          focus: dayWorkout.focus,
          totalSeconds,
          completedExercises: nextCompletedExercises,
          completedSets: totalSets,
          estimatedCalories: totalSets * 8,
          completedAt: new Date().toISOString(),
        }),
      )
      stopTimer()
      navigate("/workout/complete")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/workout">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Salir
          </Link>
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{dayWorkout.focus}</h2>
            <Badge variant="secondary">
              Ejercicio {currentExerciseIndex + 1} de {dayWorkout.exercises.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isResting ? (
          <Card className="border-2 border-orange-500">
            <CardHeader>
              <CardTitle className="text-center">Descansando</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-6xl font-bold text-orange-600 mb-2">{formatTime(timerSeconds)}</p>
                <p className="text-muted-foreground">descanso recomendado</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={isTimerRunning ? stopTimer : startTimer} className="flex-1" size="lg">
                  {isTimerRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isTimerRunning ? "Pausar" : "Continuar"}
                </Button>
                <Button
                  onClick={() => {
                    setIsResting(false)
                    resetTimer()
                  }}
                  variant="outline"
                  size="lg"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Próximo: Serie {currentSet} de {currentExercise.sets}
                </p>
                <p className="font-medium text-foreground mt-1">{currentExercise.name}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{currentExercise.name}</CardTitle>
                <Badge>
                  Serie {currentSet}/{currentExercise.sets}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold">{currentExercise.reps}</p>
                  <p className="text-sm text-muted-foreground">Repeticiones</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold">{currentExercise.restSeconds}s</p>
                  <p className="text-sm text-muted-foreground">Descanso</p>
                </div>
              </div>

              {currentExercise.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Notas:</p>
                  <p className="text-sm text-muted-foreground">{currentExercise.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Badge variant="outline">{currentExercise.muscleGroup}</Badge>
                <Badge variant="outline">{currentExercise.equipment}</Badge>
                <Badge variant="outline" className="capitalize">{currentExercise.intensity}</Badge>
              </div>

              <Button onClick={handleNextSet} className="w-full" size="lg">
                <Check className="mr-2 h-5 w-5" />
                {currentSet < currentExercise.sets ? "Serie Completada" : "Ejercicio Completado"}
              </Button>

              {currentExerciseIndex < dayWorkout.exercises.length - 1 && (
                <Button onClick={() => handleNextExercise(false)} variant="outline" className="w-full bg-transparent">
                  <SkipForward className="mr-2 h-4 w-4" />
                  Saltar Ejercicio
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
