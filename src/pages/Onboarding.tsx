import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"
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

export default function OnboardingPage() {
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
    // Si ya tiene perfil completo, redirigir al dashboard
    if (profile && profile.age && profile.fitnessGoal) {
      navigate("/dashboard")
    }
  }, [profile, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success("¡Perfil completado! Bienvenido a FitAI")
        navigate("/dashboard")
      } else {
        toast.error(result.error || "Error al guardar el perfil")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el perfil")
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
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="fixed inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 via-white to-slate-100 -z-10" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fondo degradado - cambia según el tema */}
      <div className="fixed inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 via-white to-slate-100 -z-10" />

      <div className="container px-4 py-8 max-w-4xl">
        {/* Header de Bienvenida */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold dark:text-white text-slate-900 mb-2">
            ¡Bienvenido, {user.name}!
          </h1>
          <p className="text-lg dark:text-white/70 text-slate-700">
            Completa tu perfil para crear un plan de entrenamiento personalizado con IA
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Básica */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="dark:text-white text-slate-900">Información Básica</CardTitle>
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
                      required
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
                      required
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
                      required
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
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nivel y Objetivos */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="dark:text-white text-slate-900">Nivel y Objetivos</CardTitle>
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
                      required
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
                      required
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
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="dark:text-white text-slate-900">Equipamiento Disponible</CardTitle>
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
                        className="text-sm font-normal cursor-pointer dark:text-white/90 text-slate-700"
                      >
                        {equipment.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lesiones */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="dark:text-white text-slate-900">Lesiones o Limitaciones</CardTitle>
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
                        className="text-sm font-normal cursor-pointer dark:text-white/90 text-slate-700"
                      >
                        {injury.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferencias de Entrenamiento */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="dark:text-white text-slate-900">Preferencias de Entrenamiento</CardTitle>
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
                      required
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
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón de Completar */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={isSaving}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-2xl hover:shadow-orange-500/50 transition-all px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Completar Perfil
                    <ArrowRight className="ml-2 h-4 w-4" />
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

