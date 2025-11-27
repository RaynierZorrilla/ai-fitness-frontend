// Workout Store
import { create } from "zustand"
import type { Routine, DayRoutine, WorkoutSession } from "@/lib/types"

interface WorkoutState {
  currentRoutine: Routine | null
  todayRoutine: DayRoutine | null
  activeSession: WorkoutSession | null
  currentExerciseIndex: number
  isTimerRunning: boolean
  timerSeconds: number
  setCurrentRoutine: (routine: Routine) => void
  setTodayRoutine: (routine: DayRoutine) => void
  startSession: (session: WorkoutSession) => void
  endSession: () => void
  nextExercise: () => void
  previousExercise: () => void
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  setTimerSeconds: (seconds: number) => void
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentRoutine: null,
  todayRoutine: null,
  activeSession: null,
  currentExerciseIndex: 0,
  isTimerRunning: false,
  timerSeconds: 0,
  setCurrentRoutine: (routine) => set({ currentRoutine: routine }),
  setTodayRoutine: (routine) => set({ todayRoutine: routine }),
  startSession: (session) => set({ activeSession: session, currentExerciseIndex: 0 }),
  endSession: () => set({ activeSession: null, currentExerciseIndex: 0, isTimerRunning: false }),
  nextExercise: () =>
    set((state) => ({
      currentExerciseIndex: Math.min(state.currentExerciseIndex + 1, (state.todayRoutine?.exercises.length || 1) - 1),
    })),
  previousExercise: () =>
    set((state) => ({
      currentExerciseIndex: Math.max(state.currentExerciseIndex - 1, 0),
    })),
  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  resetTimer: () => set({ timerSeconds: 0, isTimerRunning: false }),
  setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
}))
