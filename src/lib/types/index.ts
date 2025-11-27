// Types & Interfaces
export type Gender = "male" | "female" | "other"
export type Objective = "bulk" | "cut" | "definition" | "maintenance"
export type EquipmentType = "gym" | "home" | "minimal"
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Profile {
  id: string
  userId: string
  weight: number // kg
  height: number // cm
  age: number
  gender: Gender
  objective: Objective
  equipment: EquipmentType[]
  injuries: string
  availableMinutesPerDay: number
  createdAt: Date
  updatedAt: Date
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string // e.g., "8-12" or "60 seconds"
  rest: number // seconds
  notes?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  equipment: string[]
  muscleGroups: string[]
}

export interface DayRoutine {
  id: string
  routineId: string
  day: DayOfWeek
  title: string
  exercises: Exercise[]
  totalDuration: number // minutes
  focus: string // e.g., "Upper Body", "Legs", "Rest"
}

export interface Routine {
  id: string
  userId: string
  weekNumber: number
  goal: Objective
  days: DayRoutine[]
  aiVersion: string
  createdAt: Date
}

export interface Meal {
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: string[]
  instructions?: string
}

export interface NutritionPlan {
  id: string
  userId: string
  date: Date
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  shoppingList: string[]
  createdAt: Date
}

export interface Progress {
  id: string
  userId: string
  date: Date
  weight: number
  photos?: string[]
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  notes?: string
}

export interface ExerciseLog {
  id: string
  userId: string
  exerciseId: string
  date: Date
  sets: number
  reps: number[]
  weight: number[]
  completed: boolean
}

export interface WorkoutSession {
  id: string
  userId: string
  routineId: string
  dayId: string
  startTime: Date
  endTime?: Date
  completed: boolean
  exercises: ExerciseLog[]
}
