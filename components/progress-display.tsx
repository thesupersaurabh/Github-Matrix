"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Terminal } from "lucide-react"
import { useCommitStore } from "@/lib/commit-store"

interface ProgressDisplayProps {
  progress?: number
  current: number
  total: number
}

export default function ProgressDisplay({
  progress: externalProgress,
  current,
  total
}: ProgressDisplayProps) {
  const [progress, setProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
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
  }, [current, total, externalProgress])

  if (total === 0) return null

  // Get the latest logs (up to 5)
  const recentLogs = commitLogs.slice(-5)
  
  // Calculate percentage safely
  const percentage = isClient ? Math.round((current/total)*100) : 0

  return (
    <Card className="border border-green-500/30 bg-black/70 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
      <CardContent className="p-4 sm:p-6 space-y-3">
        <div className="flex justify-between text-sm text-green-500 font-mono">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-green-400" />
            <span>GENERATING_COMMITS...</span>
          </div>
          {isClient && (
            <span>{current}/{total} COMMITS ({percentage}%)</span>
          )}
        </div>
        
        <Progress value={isClient ? progress : 0} className="h-2 bg-black border border-green-500/30" />
        
        <div id="console-output" className="mt-3 border border-green-500/20 bg-black/80 rounded-md p-3 max-h-32 overflow-y-auto font-mono text-xs text-green-400/80">
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