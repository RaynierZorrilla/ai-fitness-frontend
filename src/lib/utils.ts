import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Profile } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Verifica si el perfil del usuario está completo
 * Un perfil se considera completo cuando tiene todos los campos requeridos
 */
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false

  return (
    profile.age !== null &&
    profile.gender !== null &&
    profile.heightCm !== null &&
    profile.weightKg !== null &&
    profile.experienceLevel !== null &&
    profile.fitnessGoal !== null &&
    profile.workoutDaysPerWeek !== null &&
    profile.minutesPerSession !== null
  )
}
