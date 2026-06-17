import { useEffect } from "react"
import { useWorkoutStore } from "@/lib/store/workout.store"

export function useTimer() {
  const { isTimerRunning, timerSeconds, setTimerSeconds, startTimer, stopTimer, resetTimer } = useWorkoutStore()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds <= 1) {
          setTimerSeconds(0)
          stopTimer()
          return
        }

        setTimerSeconds(timerSeconds - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return {
    isTimerRunning,
    timerSeconds,
    formattedTime: formatTime(timerSeconds),
    startTimer,
    stopTimer,
    resetTimer,
    setTimerSeconds,
  }
}
