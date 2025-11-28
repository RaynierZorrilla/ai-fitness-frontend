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
              <Badge variant="secondary" className="text-xs">
                {exercise.muscleGroup}
              </Badge>
            </div>
          </div>
          <Badge
            variant={
              exercise.intensity === "low"
                ? "default"
                : exercise.intensity === "medium"
                  ? "secondary"
                  : "destructive"
            }
            className="capitalize"
          >
            {exercise.intensity === "low" && "Baja"}
            {exercise.intensity === "medium" && "Media"}
            {exercise.intensity === "high" && "Alta"}
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
              <p className="text-sm font-semibold">{exercise.restSeconds}s</p>
            </div>
          </div>
        </div>
        {exercise.notes && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">{exercise.notes}</p>
          </div>
        )}
        {exercise.equipment && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">Equipo:</span>
            <Badge variant="outline" className="text-xs">
              {exercise.equipment}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
