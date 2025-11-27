import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Apple, ShoppingCart } from "lucide-react"
import { apiService } from "@/lib/services/api.service"

export default function NutritionPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const [nutrition, setNutrition] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchNutrition()
    }
  }, [user])

  const fetchNutrition = async () => {
    try {
      const data: any = await apiService.getTodayNutrition()
      setNutrition(data.nutrition)
    } catch (error) {
      console.error("Error fetching nutrition:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user || !nutrition) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plan Nutricional</h1>
          <p className="text-muted-foreground">Tu alimentación personalizada</p>
        </div>

        {/* Daily Summary */}
        <Card className="mb-6 bg-gradient-to-r from-red-500/5 to-orange-600/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-red-600" />
              Resumen Diario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Calorías</span>
                <span className="text-sm font-medium">{nutrition.dailyCalories} kcal</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{nutrition.macros.protein}g</p>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{nutrition.macros.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbohidratos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{nutrition.macros.fats}g</p>
                <p className="text-xs text-muted-foreground">Grasas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <div className="space-y-4 mb-6">
          {nutrition.meals.map((meal: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                  <Badge variant="secondary">{meal.calories} kcal</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {meal.foods.map((food: any, foodIndex: number) => (
                    <div key={foodIndex} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.quantity}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{food.calories} kcal</p>
                        <p>
                          P:{food.protein}g C:{food.carbs}g F:{food.fats}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Lista de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2">
              {nutrition.shoppingList.map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

