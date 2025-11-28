import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { useProfile } from "@/hooks/use-profile"
import { ProfileIncompleteModal } from "@/components/profile-incomplete-modal"
import { isProfileComplete } from "@/lib/utils"
import { Sparkles, Loader2, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function GeneratePage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { generateRoutine, isLoading } = useRoutine()
  const { profile, isLoading: profileLoading } = useProfile()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  // Verificar si el perfil está completo cuando se carga la página
  useEffect(() => {
    if (!profileLoading && profile && !isProfileComplete(profile)) {
      setShowProfileModal(true)
    }
  }, [profile, profileLoading])

  const handleGenerate = async () => {
    // Verificar si el perfil está completo antes de generar
    if (!profile || !isProfileComplete(profile)) {
      setShowProfileModal(true)
      return
    }

    setIsGenerating(true)
    setIsComplete(false)

    try {
      const result = await generateRoutine()
      if (result.success) {
        setIsComplete(true)
        toast.success("¡Rutina generada exitosamente!")
        setTimeout(() => {
          navigate("/workout")
        }, 2000)
      } else {
        toast.error(result.error || "Error al generar la rutina")
        setIsGenerating(false)
      }
    } catch (error: any) {
      toast.error(error.message || "Error al generar la rutina")
      setIsGenerating(false)
    }
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
      <div className="fixed inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 via-white to-slate-100 -z-10" />

      <ProfileIncompleteModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

      <AppHeader />
      <div className="container px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold dark:text-white text-slate-900 mb-2">
            Generar Nueva Rutina
          </h1>
          <p className="text-lg dark:text-white/70 text-slate-700">
            Crea un plan de entrenamiento personalizado con Inteligencia Artificial
          </p>
        </div>

        {/* Card Principal */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="dark:text-white text-slate-900">¿Cómo funciona?</CardTitle>
            <CardDescription>
              Nuestra IA analiza tu perfil y genera una rutina adaptada a tus objetivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-slate-900 mb-1">
                    Analizamos tu perfil
                  </h3>
                  <p className="text-sm dark:text-white/70 text-slate-700">
                    Revisamos tu nivel de experiencia, objetivos, equipamiento disponible y preferencias
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-slate-900 mb-1">
                    Generamos tu rutina
                  </h3>
                  <p className="text-sm dark:text-white/70 text-slate-700">
                    La IA crea un plan semanal personalizado con ejercicios específicos para ti
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-slate-900 mb-1">
                    ¡Listo para entrenar!
                  </h3>
                  <p className="text-sm dark:text-white/70 text-slate-700">
                    Tu nueva rutina estará disponible inmediatamente
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t dark:border-white/10 border-slate-200">
              {isComplete ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white text-slate-900">
                    ¡Rutina generada exitosamente!
                  </h3>
                  <p className="text-sm dark:text-white/70 text-slate-700">
                    Redirigiendo a tu nueva rutina...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-2xl hover:shadow-orange-500/50 transition-all"
                  >
                    {isGenerating || isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando rutina...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generar Rutina con IA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    size="lg"
                    disabled={isGenerating || isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nota */}
        <div className="mt-6 text-center">
          <p className="text-sm dark:text-white/60 text-slate-600">
            💡 Asegúrate de tener tu perfil completo para obtener mejores resultados
          </p>
        </div>
      </div>
    </div>
  )
}

