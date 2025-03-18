"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Terminal, Clock, AlertCircle } from "lucide-react"
import { useCommitStore } from "@/lib/commit-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProgressDisplayProps {
  progress?: number
  current: number
  total: number
  estimatedTimeMinutes?: number
  rateLimit?: number
}

export default function ProgressDisplay({
  progress: externalProgress,
  current,
  total,
  estimatedTimeMinutes = 0,
  rateLimit = 100
}: ProgressDisplayProps) {
  const [progress, setProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const { commitLogs } = useCommitStore()
  
  // Use useEffect to handle client-side updates to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
    } else if (total > 0) {
      const calculatedProgress = Math.round((current / total) * 100)
      setProgress(calculatedProgress)
    }
    
    // Set start time on first render
    if (startTime === null && current > 0) {
      setStartTime(Date.now())
    }
  }, [current, total, externalProgress, startTime])

  if (total === 0) return null

  // Get the latest logs (up to 8)
  const recentLogs = commitLogs.slice(-8)
  
  // Calculate percentage safely
  const percentage = isClient ? Math.min(100, Math.round((current/total)*100)) : 0
  
  // Calculate elapsed time and estimated remaining time
  const elapsedMs = startTime ? Date.now() - startTime : 0
  const elapsedMinutes = elapsedMs / 1000 / 60
  
  // Calculate remaining time based on progress and elapsed time
  let remainingMinutes = 0
  if (current > 0 && elapsedMinutes > 0) {
    const rate = current / elapsedMinutes // actual commits per minute
    remainingMinutes = (total - current) / rate
  } else {
    // Fallback to original estimate
    remainingMinutes = estimatedTimeMinutes * (1 - percentage / 100)
  }
  
  // Format times for display
  const formatTime = (minutes: number): string => {
    if (minutes < 1) return "< 1 min"
    if (minutes < 60) return `${Math.ceil(minutes)} min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.ceil(minutes % 60)
    return `${hours}h ${mins}m`
  }
  
  // Calculate actual rate
  const actualRate = elapsedMinutes > 0 ? Math.round(current / elapsedMinutes) : 0

  return (
    <Card className="border border-green-500/30 bg-black/70 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex justify-between text-sm text-green-500 font-mono">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-green-400" />
            <span>GENERATING_COMMITS...</span>
          </div>
          {isClient && (
            <span>{current}/{total} COMMITS ({percentage}%)</span>
          )}
        </div>
        
        <Progress value={isClient ? progress : 0} className="h-2.5 bg-black border border-green-500/30" />
        
        {isClient && current > 0 && (
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-green-400/90">
              <Clock className="h-3.5 w-3.5" />
              <span>Elapsed: {formatTime(elapsedMinutes)}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400/90">
              <Clock className="h-3.5 w-3.5" />
              <span>Remaining: ~{formatTime(remainingMinutes)}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400/90">
              <span>Target rate: {rateLimit} commits/min</span>
            </div>
            <div className="flex items-center gap-2 text-green-400/90">
              <span>Actual rate: {actualRate} commits/min</span>
            </div>
          </div>
        )}
        
        {isClient && current > 100 && remainingMinutes > 10 && (
          <Alert className="bg-black border-yellow-500/40">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500/90 text-xs">
              This is a long-running process. You can leave this tab open and check back later. 
              The process will continue in the background and can resume if interrupted.
            </AlertDescription>
          </Alert>
        )}
        
        <div id="console-output" className="mt-3 border border-green-500/20 bg-black/80 rounded-md p-3 max-h-36 overflow-y-auto font-mono text-xs text-green-400/80">
          <div className="flex items-center gap-1 mb-2 text-green-500 text-xs">
            <Terminal className="h-3 w-3" />
            <span>CONSOLE_OUTPUT</span>
          </div>
          {isClient && recentLogs.length > 0 ? (
            recentLogs.map((log, index) => (
              <div key={index} className="py-0.5 whitespace-pre-wrap">{log}</div>
            ))
          ) : (
            <div className="py-0.5 opacity-50">Waiting for commit generation to start...</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 