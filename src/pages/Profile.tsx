import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

export default function ProfilePage() {
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

  const handleSubmit = async (profileData: Partial<Profile>) => {
    setIsSaving(true)
    setSaveError(null)

    const result = await updateProfile(profileData)

    if (result.success) {
      toast.success("Perfil actualizado correctamente")
    } else {
      setSaveError(result.error || "Error al actualizar el perfil")
      toast.error(result.error || "Error al actualizar el perfil")
    }

    setIsSaving(false)
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

        <ProfileForm
          profile={profile}
          isSaving={isSaving}
          submitLabel="Guardar Perfil"
          error={saveError || error}
          onCancel={() => navigate("/dashboard")}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
