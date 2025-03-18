"use client"

import { useEffect, useState } from "react"

// This component ensures content only renders on the client side
export default function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/90">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return <>{children}</>
} 