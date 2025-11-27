import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface WorkoutTimerProps {
  restTime?: number
  onComplete?: () => void
}

export function WorkoutTimer({ restTime = 60, onComplete }: WorkoutTimerProps) {
  const [countdown, setCountdown] = useState(restTime)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, countdown, onComplete])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setCountdown(restTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((restTime - countdown) / restTime) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <svg className="w-48 h-48 mx-auto transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold">{formatTime(countdown)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button onClick={resetTimer} size="lg" variant="outline">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">{isActive ? "Descansando..." : "Presiona Play para comenzar"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
