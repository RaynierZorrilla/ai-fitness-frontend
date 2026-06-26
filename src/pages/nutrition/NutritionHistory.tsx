import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useAuth } from "@/hooks/use-auth"
import { useNutrition } from "@/hooks/use-nutrition"
import type { FitnessGoal } from "@/lib/types"
import { Apple, ChevronLeft, Eye, Loader2, Sparkles } from "lucide-react"

const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_fat: "Perder grasa",
  gain_muscle: "Ganar músculo",
  maintenance: "Mantenimiento",
  recomposition: "Recomposición",
}

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Sin fecha"

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function NutritionHistoryPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { mealPlans, isLoading, error, fetchHistory } = useNutrition()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  if (authLoading || isLoading) {
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
      <div className="container px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/nutrition">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historial nutricional</h1>
          <p className="text-muted-foreground">Planes generados y versiones anteriores</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>No se pudo cargar el historial</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && mealPlans.length === 0 && (
          <Empty className="min-h-[50vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Apple className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no tienes planes nutricionales</EmptyTitle>
              <EmptyDescription>Genera tu primer plan para empezar el historial.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/nutrition">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ir a nutrición
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!error && mealPlans.length > 0 && (
          <div className="space-y-4">
            {mealPlans.map((mealPlan) => (
              <Card key={mealPlan.id}>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{mealPlan.title}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{mealPlan.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{GOAL_LABELS[mealPlan.goal]}</Badge>
                      {mealPlan.isActive && <Badge className="bg-green-600 hover:bg-green-600">Actual</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Fecha</p>
                      <p className="font-medium">{formatDate(mealPlan.createdAt)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Calorías</p>
                      <p className="font-medium">{mealPlan.dailyCalories}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Días</p>
                      <p className="font-medium">{mealPlan.dayCount}</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button asChild variant="outline">
                      <Link to={`/nutrition/${mealPlan.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalle
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
