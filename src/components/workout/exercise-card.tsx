import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Exercise } from "@/lib/types"
import { Clock, Repeat, Target } from "lucide-react"

interface ExerciseCardProps {
  exercise: Exercise
  index: number
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {index + 1}
              </span>
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {exercise.muscleGroups.map((muscle) => (
                <Badge key={muscle} variant="secondary" className="text-xs">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
          <Badge
            variant={
              exercise.difficulty === "beginner"
                ? "default"
                : exercise.difficulty === "intermediate"
                  ? "secondary"
                  : "destructive"
            }
          >
            {exercise.difficulty === "beginner" && "Principiante"}
            {exercise.difficulty === "intermediate" && "Intermedio"}
            {exercise.difficulty === "advanced" && "Avanzado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Series</p>
              <p className="text-sm font-semibold">{exercise.sets}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Reps</p>
              <p className="text-sm font-semibold">{exercise.reps}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Descanso</p>
              <p className="text-sm font-semibold">{exercise.rest}s</p>
            </div>
          </div>
        </div>
        {exercise.notes && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">{exercise.notes}</p>
          </div>
        )}
        {exercise.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">Equipo:</span>
            {exercise.equipment.map((eq) => (
              <Badge key={eq} variant="outline" className="text-xs">
                {eq}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
