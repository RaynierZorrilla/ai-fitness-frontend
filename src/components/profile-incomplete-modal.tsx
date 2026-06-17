import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface ProfileIncompleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetPath?: "/profile" | "/onboarding"
}

export function ProfileIncompleteModal({
  open,
  onOpenChange,
  targetPath = "/profile",
}: ProfileIncompleteModalProps) {
  const navigate = useNavigate()

  const handleGoToProfile = () => {
    onOpenChange(false)
    navigate(targetPath)
  }

  const handleLater = () => {
    onOpenChange(false)
    navigate("/dashboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4 mx-auto">
            <User className="w-8 h-8 text-orange-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            Perfil Incompleto
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Necesitas completar tu perfil antes de generar o ver rutinas. Esto
            nos ayuda a crear un plan de entrenamiento personalizado para ti.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button
            variant="outline"
            onClick={handleLater}
            className="w-full sm:w-auto"
          >
            Más tarde
          </Button>
          <Button
            onClick={handleGoToProfile}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/50"
          >
            <User className="mr-2 h-4 w-4" />
            Ir a Perfil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
