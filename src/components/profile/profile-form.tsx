import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { profileSchema } from "@/lib/profile.schema"
import type { Profile } from "@/lib/types"
import { ArrowRight, Loader2, Save } from "lucide-react"
import type { z } from "zod"

const EQUIPMENT_OPTIONS = [
  { value: "dumbbells", label: "Mancuernas" },
  { value: "barbell", label: "Barra" },
  { value: "bench", label: "Banco" },
  { value: "pull-up_bar", label: "Barra de dominadas" },
  { value: "resistance_bands", label: "Bandas de resistencia" },
  { value: "kettlebells", label: "Kettlebells" },
  { value: "cable_machine", label: "Máquina de poleas" },
  { value: "smith_machine", label: "Máquina Smith" },
  { value: "leg_press", label: "Prensa de piernas" },
  { value: "bodyweight", label: "Peso corporal" },
]

const INJURY_OPTIONS = [
  { value: "left_knee", label: "Rodilla izquierda" },
  { value: "right_knee", label: "Rodilla derecha" },
  { value: "left_shoulder", label: "Hombro izquierdo" },
  { value: "right_shoulder", label: "Hombro derecho" },
  { value: "lower_back", label: "Espalda baja" },
  { value: "neck", label: "Cuello" },
  { value: "left_wrist", label: "Muñeca izquierda" },
  { value: "right_wrist", label: "Muñeca derecha" },
  { value: "left_ankle", label: "Tobillo izquierdo" },
  { value: "right_ankle", label: "Tobillo derecho" },
]

type ProfileFormProps = {
  profile: Profile | null
  isSaving: boolean
  submitLabel: string
  cancelLabel?: string
  variant?: "default" | "onboarding"
  error?: string | null
  onCancel?: () => void
  onSubmit: (profile: Partial<Profile>) => void
}

const emptyProfile: Partial<Profile> = {
  age: null,
  gender: null,
  heightCm: null,
  weightKg: null,
  experienceLevel: null,
  fitnessGoal: null,
  availableEquipment: [],
  injuries: [],
  workoutDaysPerWeek: null,
  minutesPerSession: null,
}

function getFieldError(errors: z.ZodFormattedError<Profile> | null, field: keyof Profile) {
  return errors?.[field]?._errors?.[0]
}

function parseNumber(value: string, parser: (value: string) => number = Number) {
  return value ? parser(value) : null
}

export function ProfileForm({
  profile,
  isSaving,
  submitLabel,
  cancelLabel = "Cancelar",
  variant = "default",
  error,
  onCancel,
  onSubmit,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>(emptyProfile)
  const [validationErrors, setValidationErrors] = useState<z.ZodFormattedError<Profile> | null>(null)
  const isOnboarding = variant === "onboarding"
  const cardClassName = isOnboarding ? "glass-card" : undefined
  const titleClassName = isOnboarding ? "dark:text-white text-slate-900" : undefined
  const labelClassName = isOnboarding ? "text-sm font-normal cursor-pointer dark:text-white/90 text-slate-700" : "text-sm font-normal cursor-pointer"

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age,
        gender: profile.gender,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        experienceLevel: profile.experienceLevel,
        fitnessGoal: profile.fitnessGoal,
        availableEquipment: profile.availableEquipment || [],
        injuries: profile.injuries || [],
        workoutDaysPerWeek: profile.workoutDaysPerWeek,
        minutesPerSession: profile.minutesPerSession,
      })
    }
  }, [profile])

  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleListValue = (field: "availableEquipment" | "injuries", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...(prev[field] || []), value] : (prev[field] || []).filter((item) => item !== value),
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = profileSchema.safeParse(formData)

    if (!result.success) {
      setValidationErrors(result.error.format() as z.ZodFormattedError<Profile>)
      return
    }

    setValidationErrors(null)
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className={titleClassName}>Información Básica</CardTitle>
            <CardDescription>Datos personales y físicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input id="age" type="number" min="1" max="120" placeholder="27" value={formData.age || ""} onChange={(event) => updateField("age", parseNumber(event.target.value, parseInt))} />
                {getFieldError(validationErrors, "age") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "age")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select value={formData.gender || ""} onValueChange={(value) => updateField("gender", value as Profile["gender"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError(validationErrors, "gender") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "gender")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heightCm">Altura (cm)</Label>
                <Input id="heightCm" type="number" min="1" max="250" placeholder="183" value={formData.heightCm || ""} onChange={(event) => updateField("heightCm", parseNumber(event.target.value))} />
                {getFieldError(validationErrors, "heightCm") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "heightCm")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Peso (kg)</Label>
                <Input id="weightKg" type="number" min="1" max="300" step="0.1" placeholder="84" value={formData.weightKg || ""} onChange={(event) => updateField("weightKg", parseNumber(event.target.value))} />
                {getFieldError(validationErrors, "weightKg") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "weightKg")}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className={titleClassName}>Nivel y Objetivos</CardTitle>
            <CardDescription>Tu experiencia y metas de entrenamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Nivel de Experiencia</Label>
                <Select value={formData.experienceLevel || ""} onValueChange={(value) => updateField("experienceLevel", value as Profile["experienceLevel"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError(validationErrors, "experienceLevel") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "experienceLevel")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Objetivo de Entrenamiento</Label>
                <Select value={formData.fitnessGoal || ""} onValueChange={(value) => updateField("fitnessGoal", value as Profile["fitnessGoal"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_fat">Perder grasa</SelectItem>
                    <SelectItem value="gain_muscle">Ganar músculo</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="recomposition">Recomposición corporal</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError(validationErrors, "fitnessGoal") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "fitnessGoal")}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className={titleClassName}>Equipamiento Disponible</CardTitle>
            <CardDescription>Selecciona todo el equipamiento que tienes disponible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <div key={equipment.value} className="flex items-center space-x-2">
                  <Checkbox id={`equipment-${equipment.value}`} checked={formData.availableEquipment?.includes(equipment.value)} onCheckedChange={(checked) => toggleListValue("availableEquipment", equipment.value, Boolean(checked))} />
                  <Label htmlFor={`equipment-${equipment.value}`} className={labelClassName}>{equipment.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className={titleClassName}>Lesiones o Limitaciones</CardTitle>
            <CardDescription>Indica si tienes alguna lesión o limitación física (opcional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {INJURY_OPTIONS.map((injury) => (
                <div key={injury.value} className="flex items-center space-x-2">
                  <Checkbox id={`injury-${injury.value}`} checked={formData.injuries?.includes(injury.value)} onCheckedChange={(checked) => toggleListValue("injuries", injury.value, Boolean(checked))} />
                  <Label htmlFor={`injury-${injury.value}`} className={labelClassName}>{injury.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className={titleClassName}>Preferencias de Entrenamiento</CardTitle>
            <CardDescription>Frecuencia y duración de tus entrenamientos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutDaysPerWeek">Días de Entrenamiento por Semana</Label>
                <Input id="workoutDaysPerWeek" type="number" min="1" max="7" placeholder="5" value={formData.workoutDaysPerWeek || ""} onChange={(event) => updateField("workoutDaysPerWeek", parseNumber(event.target.value, parseInt))} />
                {getFieldError(validationErrors, "workoutDaysPerWeek") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "workoutDaysPerWeek")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minutesPerSession">Minutos por Sesión</Label>
                <Input id="minutesPerSession" type="number" min="15" max="180" step="5" placeholder="60" value={formData.minutesPerSession || ""} onChange={(event) => updateField("minutesPerSession", parseNumber(event.target.value, parseInt))} />
                {getFieldError(validationErrors, "minutesPerSession") && <p className="text-sm text-destructive">{getFieldError(validationErrors, "minutesPerSession")}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={isOnboarding ? "flex justify-center pt-4" : "flex justify-end gap-4"}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isSaving} size={isOnboarding ? "lg" : "default"} className={isOnboarding ? "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-2xl hover:shadow-orange-500/50 transition-all px-8" : undefined}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                {isOnboarding ? null : <Save className="mr-2 h-4 w-4" />}
                {submitLabel}
                {isOnboarding ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
