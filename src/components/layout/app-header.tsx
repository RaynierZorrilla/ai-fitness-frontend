import { Dumbbell, User, Settings, FileText, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    navigate("/auth/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="glass-strong sticky top-0 z-50 w-full border-b dark:border-white/10 border-slate-200/50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold dark:text-white text-slate-900">FitAI</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative h-10 w-10 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-strong dark:border-white/10 border-slate-200/50">
              <DropdownMenuLabel className="dark:text-white text-slate-900">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none dark:text-white text-slate-900">{user?.name || "Usuario"}</p>
                  <p className="text-xs leading-none dark:text-white/60 text-slate-600">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-white/10 bg-slate-200/50" />
              <DropdownMenuItem asChild className="dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10 text-slate-900 hover:bg-slate-100">
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10 text-slate-900 hover:bg-slate-100">
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10 text-slate-900 hover:bg-slate-100">
                <Link to="/terms" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Términos y Condiciones</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-white/10 bg-slate-200/50" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
