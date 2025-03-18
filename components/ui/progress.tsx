"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-sm bg-black border border-green-500/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-green-900 via-green-500 to-green-300 transition-all relative overflow-hidden"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
      }}
    >
      {/* Animated cyberpunk lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,transparent_40%,rgba(0,255,0,0.5)_50%,transparent_60%,transparent_100%)] bg-[length:200%_100%]"
        style={{
          animation: "moveGlow 1.5s linear infinite"
        }}
      />
      <style jsx>{`
        @keyframes moveGlow {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }
      `}</style>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
