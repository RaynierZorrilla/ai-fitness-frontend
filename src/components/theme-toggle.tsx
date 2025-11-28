import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Determinar si el tema actual es oscuro
    const root = window.document.documentElement
    const isDarkMode = root.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [theme])

  const toggleTheme = () => {
    // Si el tema es "system", determinar el tema actual y cambiarlo
    if (theme === "system") {
      const root = window.document.documentElement
      const isDarkMode = root.classList.contains("dark")
      setTheme(isDarkMode ? "light" : "dark")
    } else {
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="glass hover:glass-strong transition-all h-10 w-10 rounded-xl"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5 dark:text-white text-slate-900" />
      ) : (
        <Moon className="h-5 w-5 dark:text-white text-slate-900" />
      )}
    </Button>
  )
}

