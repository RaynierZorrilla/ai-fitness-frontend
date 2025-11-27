// Types & Interfaces
export type Gender = "male" | "female" | "other"
export type FitnessGoal = "lose_fat" | "gain_muscle" | "maintenance" | "recomposition"
export type ExperienceLevel = "beginner" | "intermediate" | "advanced"
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
export type Intensity = "low" | "medium" | "high"

export interface User {
  id: string
  email: string
  name?: string | null
}

export interface Profile {
  age: number | null
  gender: "male" | "female" | "other" | null
  heightCm: number | null
  weightKg: number | null
  experienceLevel: "beginner" | "intermediate" | "advanced" | null
  fitnessGoal: "lose_fat" | "gain_muscle" | "maintenance" | "recomposition" | null
  availableEquipment: string[]
  injuries: string[]
  workoutDaysPerWeek: number | null
  minutesPerSession: number | null
}

export interface Exercise {
  name: string
  muscleGroup: string
  sets: number
  reps: string // e.g., "8-10", "12-15"
  restSeconds: number
  equipment: string
  intensity: "low" | "medium" | "high"
  notes?: string
}

export interface RoutineDay {
  id: string
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  position: number
  focus: string
  exercises: Exercise[]
}

export interface Routine {
  id: string
  title: string
  description: string
  goal: "lose_fat" | "gain_muscle" | "maintenance" | "recomposition"
  days: RoutineDay[]
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
