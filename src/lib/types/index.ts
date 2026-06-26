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

export interface RoutineHistoryItem {
  id: string
  title: string
  description: string
  goal: FitnessGoal
  isActive: boolean
  createdAt: string
  dayCount: number
  exerciseCount: number
}

export interface RoutineHistoryResponse {
  routines: RoutineHistoryItem[]
}

export interface RoutineDetailResponse {
  routine: Routine & {
    isActive: boolean
    createdAt: string
    updatedAt: string
    dayCount: number
    exerciseCount: number
  }
}

export interface RoutineAdjustmentAnalysis {
  summary: string
  progressStatus: "improving" | "maintaining" | "declining" | string
  fatigueLevel: "low" | "medium" | "high" | string
  recommendedAdjustment: string
  adherencePercentage?: number | null
  averageDifficulty?: number | null
  weightChangeKg?: number | null
  waistChangeCm?: number | null
  volumeChangePercent?: number | null
  restAdjustment?: string | null
}

export interface RoutineAdjustmentResponse {
  analysis: RoutineAdjustmentAnalysis
  routine: Routine
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

export interface CompletedWorkoutSummary {
  routineId: string
  dayId: string
  dayOfWeek: DayOfWeek
  focus: string
  totalSeconds: number
  completedExercises: number
  completedSets: number
  estimatedCalories: number
  completedAt: string
}

export interface CreateWorkoutSessionInput {
  routineId: string
  dayId: string
  performedAt?: string
  totalSeconds?: number
  completedExercises?: number
  completedSets?: number
  estimatedCalories?: number
  difficultyRating?: number | null
}

export interface WorkoutSessionRecord {
  id: string
  userId: string
  routineId: string
  dayId: string
  performedAt: string
  totalSeconds: number
  completedExercises: number
  completedSets: number
  estimatedCalories: number
  difficultyRating?: number | null
}

export interface WorkoutSummaryStats {
  totalSessions: number
  currentWeekSessions: number
  totalCalories: number
  totalWorkoutTimeMinutes: number
}

export interface ProgressEntry {
  id: string
  userId: string
  weightKg: number | null
  bodyFatPercentage: number | null
  chestCm: number | null
  waistCm: number | null
  armsCm: number | null
  legsCm: number | null
  notes: string | null
  recordedAt: string
}

export interface CreateProgressEntryInput {
  weightKg?: number
  bodyFatPercentage?: number
  chestCm?: number
  waistCm?: number
  armsCm?: number
  legsCm?: number
  notes?: string
  recordedAt?: string
}

export interface ProgressHistoryResponse {
  entries: ProgressEntry[]
}

export interface ProgressLatestResponse {
  entry: ProgressEntry | null
}

export interface CreateProgressResponse {
  entry: ProgressEntry
}

export interface FitnessOverviewResponse {
  totalSessions: number
  averageDifficulty: number | null
  weightChangeKg: number | null
  waistChangeCm: number | null
  adherencePercentage: number | null
  currentWeightKg?: number | null
  currentWaistCm?: number | null
  currentWeekSessions?: number
  totalWorkoutTimeMinutes?: number
  totalCalories?: number
}
