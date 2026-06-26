import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useNutrition } from "@/hooks/use-nutrition"
import { DAY_LABELS } from "@/lib/days"
import type { FitnessGoal } from "@/lib/types"
import { Apple, ChevronLeft, Loader2 } from "lucide-react"

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

export default function NutritionDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const { selectedMealPlan, isLoading, error, fetchById } = useNutrition()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (user && id) {
      fetchById(id)
    }
  }, [user, id])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const days = selectedMealPlan && Array.isArray(selectedMealPlan.days) ? selectedMealPlan.days : []
  const macros = selectedMealPlan?.macros ?? { proteinG: 0, carbsG: 0, fatsG: 0 }
  const planDate = selectedMealPlan?.createdAt || selectedMealPlan?.updatedAt

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      <div className="container px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/nutrition/history">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cargar el plan</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && selectedMealPlan && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-red-500/5 to-orange-600/5 border-red-500/20">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Apple className="h-6 w-6 text-red-600" />
                      {selectedMealPlan.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{selectedMealPlan.description}</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{GOAL_LABELS[selectedMealPlan.goal]}</Badge>
                    {planDate && <Badge variant="outline">{formatDate(planDate)}</Badge>}
                    {typeof selectedMealPlan.isActive === "boolean" && (
                      selectedMealPlan.isActive ? (
                        <Badge className="bg-green-600 hover:bg-green-600">Actual</Badge>
                      ) : (
                        <Badge variant="outline">Anterior</Badge>
                      )
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedMealPlan.dailyCalories}</p>
                  <p className="text-xs text-muted-foreground">Calorías</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{macros.proteinG}g</p>
                  <p className="text-xs text-muted-foreground">Proteína</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{macros.carbsG}g</p>
                  <p className="text-xs text-muted-foreground">Carbos</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{macros.fatsG}g</p>
                  <p className="text-xs text-muted-foreground">Grasas</p>
                </div>
              </CardContent>
            </Card>

            {days.length > 0 ? (
              <Tabs defaultValue={days[0]?.dayOfWeek || "monday"} className="w-full">
                <TabsList className="mb-4 flex h-auto flex-wrap">
                  {days.map((day) => (
                    <TabsTrigger key={day.id ?? day.dayOfWeek} value={day.dayOfWeek}>
                      {DAY_LABELS[day.dayOfWeek]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {days.map((day) => {
                  const meals = Array.isArray(day.meals) ? day.meals : []

                  return (
                    <TabsContent key={day.id ?? day.dayOfWeek} value={day.dayOfWeek}>
                      <div className="space-y-4">
                        {meals.length > 0 ? (
                          meals.map((meal, index) => {
                            const foods = Array.isArray(meal.foods) ? meal.foods : []

                            return (
                              <Card key={`${meal.name}-${index}`}>
                                <CardHeader>
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                                      <CardDescription>
                                        P:{meal.proteinG}g C:{meal.carbsG}g F:{meal.fatsG}g
                                      </CardDescription>
                                    </div>
                                    <Badge variant="secondary">{meal.calories} kcal</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  {foods.length > 0 ? (
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                      {foods.map((food) => (
                                        <li key={food} className="flex items-center gap-2 text-sm">
                                          <div className="h-2 w-2 rounded-full bg-orange-500" />
                                          {food}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Sin alimentos registrados.</p>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })
                        ) : (
                          <Card>
                            <CardContent className="py-6 text-sm text-muted-foreground">
                              Sin comidas registradas para este día.
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Este plan todavía no incluye días o comidas.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
