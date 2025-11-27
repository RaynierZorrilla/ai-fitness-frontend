import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRoutine } from "@/hooks/use-routine"
import { Dumbbell, Apple, TrendingUp, Calendar, Play, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { routine, fetchLatestRoutine } = useRoutine()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchLatestRoutine()
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  const today = new Date().toLocaleDateString("es-ES", { weekday: "long" })
  const todayWorkout = routine?.days?.find((dayRoutine) => dayRoutine.day.toLowerCase() === today.toLowerCase())

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hola, {user.name}!</h1>
          <p className="text-muted-foreground">Aquí está tu resumen de hoy</p>
        </div>

        {/* Today's Workout */}
        {todayWorkout && (
          <Card className="mb-6 border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-600/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Entrenamiento de Hoy
                  </CardTitle>
                  <CardDescription className="text-base font-medium mt-1">{todayWorkout.focus}</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/workout">
                    <Play className="mr-2 h-4 w-4" />
                    Comenzar
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{todayWorkout.exercises.length} ejercicios programados</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-orange-600" />
                Entrenamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">32</p>
              <p className="text-xs text-muted-foreground">completados este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Apple className="h-4 w-4 text-red-600" />
                Nutrición
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2,500</p>
              <p className="text-xs text-muted-foreground">calorías objetivo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-2 kg</p>
              <p className="text-xs text-muted-foreground">últimos 30 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/routine">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-orange-600" />
                  Ver Rutina Completa
                </CardTitle>
                <CardDescription>Revisa tu plan de entrenamiento semanal</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/nutrition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-red-600" />
                  Plan Nutricional
                </CardTitle>
                <CardDescription>Consulta tus comidas y macros del día</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/progress">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Seguimiento
                </CardTitle>
                <CardDescription>Visualiza tu evolución y estadísticas</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-orange-500/30">
            <Link to="/generate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  Generar Nueva Rutina
                </CardTitle>
                <CardDescription>Crea un plan personalizado con IA</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

