import { z } from "zod"

export const profileSchema = z.object({
  age: z.number({ required_error: "Ingresa tu edad" }).positive("La edad debe ser mayor a 0"),
  gender: z.enum(["male", "female", "other"], { required_error: "Selecciona tu género" }),
  heightCm: z
    .number({ required_error: "Ingresa tu altura" })
    .positive("La altura debe ser mayor a 0"),
  weightKg: z.number({ required_error: "Ingresa tu peso" }).positive("El peso debe ser mayor a 0"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Selecciona tu nivel de experiencia",
  }),
  fitnessGoal: z.enum(["lose_fat", "gain_muscle", "maintenance", "recomposition"], {
    required_error: "Selecciona tu objetivo",
  }),
  availableEquipment: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([]),
  workoutDaysPerWeek: z
    .number({ required_error: "Ingresa tus días de entrenamiento" })
    .min(1, "Debe ser entre 1 y 7 días")
    .max(7, "Debe ser entre 1 y 7 días"),
  minutesPerSession: z
    .number({ required_error: "Ingresa los minutos por sesión" })
    .min(15, "Debe ser entre 15 y 180 minutos")
    .max(180, "Debe ser entre 15 y 180 minutos"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
