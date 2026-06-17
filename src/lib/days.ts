import type { DayOfWeek } from "@/lib/types"

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
}

export function getTodayDayOfWeek(): DayOfWeek {
  const index = new Date().getDay()
  return DAYS_OF_WEEK[index === 0 ? 6 : index - 1]
}

export function isDayOfWeek(value: string | null): value is DayOfWeek {
  return Boolean(value && DAYS_OF_WEEK.includes(value.toLowerCase() as DayOfWeek))
}
