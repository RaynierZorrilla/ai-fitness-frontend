import { Button } from "@/components/ui/button"
import { Dumbbell, Sparkles, LineChart, Apple, Zap } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fondo degradado - cambia según el tema */}
      <div className="fixed inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 via-white to-slate-100 -z-10" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20 pt-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm dark:text-white/90 text-slate-900/90 mb-6">
            <Zap className="w-4 h-4 text-orange-500" />
            Potenciado por IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight">
            Tu entrenador personal con{" "}
            <span className="text-gradient">Inteligencia Artificial</span>
          </h1>

          <p className="text-xl dark:text-white/70 text-slate-700 max-w-2xl mx-auto mb-8">
            Rutinas personalizadas, planes nutricionales adaptados y seguimiento inteligente para alcanzar tus objetivos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-xl text-white text-lg font-medium hover:shadow-2xl hover:shadow-orange-500/50 transition-all"
            >
              Comenzar Gratis
            </Link>
            <Link
              to="/auth/login"
              className="glass-strong px-8 py-4 rounded-xl dark:text-white text-slate-900 text-lg font-medium dark:hover:bg-white/15 hover:bg-slate-100 transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="glass-card rounded-2xl p-8 hover:glass-strong transition-all group">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Dumbbell className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold dark:text-white text-slate-900 mb-3">Rutinas Personalizadas</h3>
            <p className="dark:text-white/70 text-slate-700 leading-relaxed">
              La IA genera rutinas adaptadas a tu nivel, objetivos y equipo disponible
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 hover:glass-strong transition-all group">
            <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Apple className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold dark:text-white text-slate-900 mb-3">Planes Nutricionales</h3>
            <p className="dark:text-white/70 text-slate-700 leading-relaxed">
              Dietas completas con recetas y lista de compras personalizadas
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 hover:glass-strong transition-all group">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <LineChart className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold dark:text-white text-slate-900 mb-3">Seguimiento Inteligente</h3>
            <p className="dark:text-white/70 text-slate-700 leading-relaxed">
              Análisis de progreso y ajustes automáticos para mejores resultados
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="glass-strong rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold dark:text-white text-slate-900 mb-4">¿Listo para transformarte?</h2>
          <p className="text-xl dark:text-white/70 text-slate-700 mb-8">
            Únete a miles de usuarios que ya están alcanzando sus objetivos
          </p>
          <Link
            to="/auth/register"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-xl text-white text-lg font-medium hover:shadow-2xl hover:shadow-orange-500/50 transition-all"
          >
            Empezar Ahora
          </Link>
        </section>
      </main>
    </div>
  )
}

