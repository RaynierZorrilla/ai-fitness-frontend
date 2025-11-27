import { Button } from "@/components/ui/button"
import { Dumbbell, Sparkles, LineChart, Apple } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 mb-6 backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Potenciado por IA</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-balance">
              Tu entrenador personal con{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Rutinas personalizadas, planes nutricionales y seguimiento de progreso. Todo diseñado específicamente para
              ti por nuestra IA avanzada.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg h-12 px-8">
                <Link to="/auth/register">Comenzar Gratis</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent">
                <Link to="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold">Rutinas Personalizadas</h3>
              <p className="text-muted-foreground">
                La IA genera rutinas adaptadas a tu nivel, objetivos y equipo disponible
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Apple className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Planes Nutricionales</h3>
              <p className="text-muted-foreground">Dietas completas con recetas y lista de compras personalizadas</p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold">Seguimiento Inteligente</h3>
              <p className="text-muted-foreground">
                Análisis de progreso y ajustes automáticos para mejores resultados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para transformarte?</h2>
            <p className="text-muted-foreground mb-8">
              Únete a miles de usuarios que ya están alcanzando sus objetivos
            </p>
            <Button asChild size="lg" className="text-lg h-12 px-8">
              <Link to="/auth/register">Empezar Ahora</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

