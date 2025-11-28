import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { Loader2, Save, User } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

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

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { profile, isLoading: profileLoading, updateProfile } = useProfile()

  const [formData, setFormData] = useState<Partial<Profile>>({
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
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success("Perfil actualizado correctamente")
      } else {
        toast.error(result.error || "Error al actualizar el perfil")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableEquipment: checked
        ? [...(prev.availableEquipment || []), equipment]
        : (prev.availableEquipment || []).filter((e) => e !== equipment),
    }))
  }

  const handleInjuryChange = (injury: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      injuries: checked
        ? [...(prev.injuries || []), injury]
        : (prev.injuries || []).filter((i) => i !== injury),
    }))
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <User className="h-8 w-8" />
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Completa tu información para generar un plan de entrenamiento personalizado
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Datos personales y físicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="27"
                      value={formData.age || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          gender: value as "male" | "female" | "other" | null,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heightCm">Altura (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      min="50"
                      max="250"
                      placeholder="183"
                      value={formData.heightCm || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          heightCm: e.target.value ? parseFloat(e.target.value) : null,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Peso (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      min="20"
                      max="300"
                      step="0.1"
                      placeholder="84"
                      value={formData.weightKg || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weightKg: e.target.value ? parseFloat(e.target.value) : null,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nivel y Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle>Nivel y Objetivos</CardTitle>
                <CardDescription>Tu experiencia y metas de entrenamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Nivel de Experiencia</Label>
                    <Select
                      value={formData.experienceLevel || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          experienceLevel: value as "beginner" | "intermediate" | "advanced" | null,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">Objetivo de Entrenamiento</Label>
                    <Select
                      value={formData.fitnessGoal || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          fitnessGoal: value as
                            | "lose_fat"
                            | "gain_muscle"
                            | "maintenance"
                            | "recomposition"
                            | null,
                        }))
                      }
                    >
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipamiento Disponible */}
            <Card>
              <CardHeader>
                <CardTitle>Equipamiento Disponible</CardTitle>
                <CardDescription>Selecciona todo el equipamiento que tienes disponible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {EQUIPMENT_OPTIONS.map((equipment) => (
                    <div key={equipment.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipment-${equipment.value}`}
                        checked={formData.availableEquipment?.includes(equipment.value)}
                        onCheckedChange={(checked) =>
                          handleEquipmentChange(equipment.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`equipment-${equipment.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {equipment.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lesiones */}
            <Card>
              <CardHeader>
                <CardTitle>Lesiones o Limitaciones</CardTitle>
                <CardDescription>
                  Indica si tienes alguna lesión o limitación física (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {INJURY_OPTIONS.map((injury) => (
                    <div key={injury.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`injury-${injury.value}`}
                        checked={formData.injuries?.includes(injury.value)}
                        onCheckedChange={(checked) =>
                          handleInjuryChange(injury.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`injury-${injury.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {injury.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferencias de Entrenamiento */}
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Entrenamiento</CardTitle>
                <CardDescription>Frecuencia y duración de tus entrenamientos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workoutDaysPerWeek">Días de Entrenamiento por Semana</Label>
                    <Input
                      id="workoutDaysPerWeek"
                      type="number"
                      min="1"
                      max="7"
                      placeholder="5"
                      value={formData.workoutDaysPerWeek || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          workoutDaysPerWeek: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minutesPerSession">Minutos por Sesión</Label>
                    <Input
                      id="minutesPerSession"
                      type="number"
                      min="15"
                      max="180"
                      step="5"
                      placeholder="60"
                      value={formData.minutesPerSession || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          minutesPerSession: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón de Guardar */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Perfil
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

