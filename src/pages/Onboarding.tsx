import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileForm } from "@/components/profile/profile-form"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { isProfileComplete } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { profile, isLoading: profileLoading, error, updateProfile } = useProfile()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (profile && isProfileComplete(profile)) {
      navigate("/dashboard")
    }
  }, [profile, navigate])

  const handleSubmit = async (profileData: Partial<Profile>) => {
    setIsSaving(true)
    setSaveError(null)

    const result = await updateProfile(profileData)

    if (result.success) {
      toast.success("Perfil completado. Bienvenido a FitAI")
      navigate("/dashboard")
    } else {
      setSaveError(result.error || "Error al guardar el perfil")
      toast.error(result.error || "Error al guardar el perfil")
    }

    setIsSaving(false)
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

      <div className="container px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold dark:text-white text-slate-900 mb-2">
            Bienvenido, {user.name}
          </h1>
          <p className="text-lg dark:text-white/70 text-slate-700">
            Completa tu perfil para crear un plan de entrenamiento personalizado con IA
          </p>
        </div>

        <ProfileForm
          profile={profile}
          isSaving={isSaving}
          submitLabel="Completar Perfil"
          variant="onboarding"
          error={saveError || error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
