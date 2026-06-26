import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useProgress } from "@/hooks/use-progress"
import type { CreateProgressEntryInput, ProgressEntry } from "@/lib/types"
import { ChevronLeft, Loader2, Ruler, Save, Scale, TrendingUp } from "lucide-react"
import { toast } from "sonner"

type ProgressFormState = {
  weightKg: string
  bodyFatPercentage: string
  chestCm: string
  waistCm: string
  armsCm: string
  legsCm: string
  notes: string
  recordedAt: string
}

const emptyForm: ProgressFormState = {
  weightKg: "",
  bodyFatPercentage: "",
  chestCm: "",
  waistCm: "",
  armsCm: "",
  legsCm: "",
  notes: "",
  recordedAt: "",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

function formatWeight(weightKg: number | null) {
  if (weightKg === null) return "Sin peso"

  const pounds = weightKg * 2.20462
  return `${pounds.toFixed(1)} lb / ${weightKg.toFixed(1)} kg`
}

function parseOptionalNumber(value: string) {
  if (!value) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function buildPayload(formData: ProgressFormState): CreateProgressEntryInput {
  return {
    weightKg: parseOptionalNumber(formData.weightKg),
    bodyFatPercentage: parseOptionalNumber(formData.bodyFatPercentage),
    chestCm: parseOptionalNumber(formData.chestCm),
    waistCm: parseOptionalNumber(formData.waistCm),
    armsCm: parseOptionalNumber(formData.armsCm),
    legsCm: parseOptionalNumber(formData.legsCm),
    notes: formData.notes.trim() || undefined,
    recordedAt: formData.recordedAt ? new Date(`${formData.recordedAt}T12:00:00`).toISOString() : undefined,
  }
}

function ProgressSummaryCard({ entry }: { entry: ProgressEntry }) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-green-500/5 to-blue-600/5 border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Último registro
        </CardTitle>
        <CardDescription>{formatDate(entry.recordedAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-5 gap-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Scale className="h-4 w-4" />
              <span className="text-sm">Peso</span>
            </div>
            <p className="text-xl font-bold">{formatWeight(entry.weightKg)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Ruler className="h-4 w-4" />
              <span className="text-sm">Cintura</span>
            </div>
            <p className="text-xl font-bold">{entry.waistCm !== null ? `${entry.waistCm} cm` : "Sin dato"}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Ruler className="h-4 w-4" />
              <span className="text-sm">Brazos</span>
            </div>
            <p className="text-xl font-bold">{entry.armsCm !== null ? `${entry.armsCm} cm` : "Sin dato"}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">% grasa</span>
            </div>
            <p className="text-xl font-bold">
              {entry.bodyFatPercentage !== null ? `${entry.bodyFatPercentage}%` : "Sin dato"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Ruler className="h-4 w-4" />
              <span className="text-sm">Piernas</span>
            </div>
            <p className="text-xl font-bold">{entry.legsCm !== null ? `${entry.legsCm} cm` : "Sin dato"}</p>
          </div>
        </div>
        {entry.notes && <p className="mt-4 text-sm text-muted-foreground">{entry.notes}</p>}
      </CardContent>
    </Card>
  )
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { latestEntry, entries, isLoading, isSaving, error, fetchLatest, fetchHistory, createEntry } = useProgress()
  const [formData, setFormData] = useState<ProgressFormState>(emptyForm)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login")
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (user) {
      fetchLatest()
      fetchHistory()
    }
  }, [user])

  const updateField = (field: keyof ProgressFormState, value: string) => {
    setFormData((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload = buildPayload(formData)
    const hasMetric = Object.entries(payload).some(([key, value]) => key !== "recordedAt" && value !== undefined)

    if (!hasMetric) {
      toast.error("Agrega al menos una métrica o una nota.")
      return
    }

    const result = await createEntry(payload)

    if (result.success) {
      toast.success("Progreso guardado correctamente")
      setFormData(emptyForm)
    } else {
      toast.error(result.error || "No se pudo guardar el progreso")
    }
  }

  if (authLoading || (isLoading && entries.length === 0 && !latestEntry)) {
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progreso</h1>
          <p className="text-muted-foreground">Registra medidas corporales y notas de evolución</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>No se pudo cargar progreso</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {latestEntry ? (
          <ProgressSummaryCard entry={latestEntry} />
        ) : (
          <Empty className="mb-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no tienes registros de progreso</EmptyTitle>
              <EmptyDescription>Guarda tu primera medición para empezar a ver tu evolución.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo registro</CardTitle>
              <CardDescription>Peso, medidas y notas del día</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Peso (kg)</Label>
                    <Input id="weightKg" type="number" min="1" step="0.1" value={formData.weightKg} onChange={(event) => updateField("weightKg", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waistCm">Cintura (cm)</Label>
                    <Input id="waistCm" type="number" min="1" step="0.1" value={formData.waistCm} onChange={(event) => updateField("waistCm", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="armsCm">Brazos (cm)</Label>
                    <Input id="armsCm" type="number" min="1" step="0.1" value={formData.armsCm} onChange={(event) => updateField("armsCm", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFatPercentage">% grasa</Label>
                    <Input id="bodyFatPercentage" type="number" min="1" max="100" step="0.1" value={formData.bodyFatPercentage} onChange={(event) => updateField("bodyFatPercentage", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chestCm">Pecho (cm)</Label>
                    <Input id="chestCm" type="number" min="1" step="0.1" value={formData.chestCm} onChange={(event) => updateField("chestCm", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legsCm">Piernas (cm)</Label>
                    <Input id="legsCm" type="number" min="1" step="0.1" value={formData.legsCm} onChange={(event) => updateField("legsCm", event.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="recordedAt">Fecha</Label>
                    <Input id="recordedAt" type="date" value={formData.recordedAt} onChange={(event) => updateField("recordedAt", event.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea id="notes" value={formData.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Energía, cambios visibles, cómo te sentiste..." />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar progreso
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
              <CardDescription>Registros recientes</CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>Sin historial</EmptyTitle>
                    <EmptyDescription>Los registros aparecerán aquí.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="font-medium">{formatDate(entry.recordedAt)}</p>
                        {entry.bodyFatPercentage !== null && (
                          <span className="text-xs text-muted-foreground">{entry.bodyFatPercentage}% grasa</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <span>Peso: {formatWeight(entry.weightKg)}</span>
                        <span>Cintura: {entry.waistCm !== null ? `${entry.waistCm} cm` : "Sin dato"}</span>
                        <span>Brazos: {entry.armsCm !== null ? `${entry.armsCm} cm` : "Sin dato"}</span>
                        <span>Piernas: {entry.legsCm !== null ? `${entry.legsCm} cm` : "Sin dato"}</span>
                      </div>
                      {entry.notes && <p className="mt-3 text-sm text-muted-foreground">{entry.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
