import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useNutrition } from "@/hooks/use-nutrition"
import { DAY_LABELS } from "@/lib/days"
import type { FitnessGoal, MealPlan } from "@/lib/types"
import { Apple, ChevronLeft, History, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_fat: "Perder grasa",
  gain_muscle: "Ganar músculo",
  maintenance: "Mantenimiento",
  recomposition: "Recomposición",
}

function MealPlanView({ mealPlan }: { mealPlan: MealPlan }) {
  const days = Array.isArray(mealPlan.days) ? mealPlan.days : []
  const macros = mealPlan.macros ?? { proteinG: 0, carbsG: 0, fatsG: 0 }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-500/5 to-orange-600/5 border-red-500/20">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-red-600" />
                {mealPlan.title}
              </CardTitle>
              <CardDescription className="mt-1">{mealPlan.description}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{GOAL_LABELS[mealPlan.goal]}</Badge>
              {mealPlan.isActive && <Badge className="bg-green-600 hover:bg-green-600">Actual</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{mealPlan.dailyCalories}</p>
              <p className="text-xs text-muted-foreground">Calorías diarias</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{macros.proteinG}g</p>
              <p className="text-xs text-muted-foreground">Proteína</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{macros.carbsG}g</p>
              <p className="text-xs text-muted-foreground">Carbohidratos</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{macros.fatsG}g</p>
              <p className="text-xs text-muted-foreground">Grasas</p>
            </div>
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
  )
}

export default function NutritionPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { currentMealPlan, isLoading, isGenerating, error, fetchCurrent, generate } = useNutrition()
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!user) return

    fetchCurrent().finally(() => setHasLoaded(true))
  }, [user])

  const handleGenerate = async () => {
    const result = await generate()

    if (result.success) {
      toast.success("Plan nutricional generado correctamente")
    } else {
      toast.error(result.error || "No se pudo generar el plan nutricional")
    }
  }

  if (authLoading || (isLoading && !hasLoaded)) {
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
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Plan Nutricional</h1>
            <p className="text-muted-foreground">Tu alimentación personalizada con IA</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-gradient-to-r from-orange-500 to-red-600">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar plan con IA
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/nutrition/history">
                <History className="mr-2 h-4 w-4" />
                Ver historial
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>No se pudo cargar nutrición</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!currentMealPlan ? (
          <Empty className="min-h-[55vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Apple className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no tienes un plan nutricional.</EmptyTitle>
              <EmptyDescription>Genera un plan personalizado para ver tus comidas semanales.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar plan con IA
                  </>
                )}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <MealPlanView mealPlan={currentMealPlan} />
        )}
      </div>
    </div>
  )
}
