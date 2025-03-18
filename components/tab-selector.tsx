"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConfigurationForm from "@/components/configuration-form"
import PatternSelector from "@/components/pattern-selector"

export default function TabSelector() {
  const [activeTab, setActiveTab] = useState("configuration")
  const [mounted, setMounted] = useState(false)
  
  // This ensures the component only renders on the client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Display loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    )
  }
  
  return (
    <div className="w-full">
      <Tabs 
        defaultValue="configuration" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-black/80 border-2 border-green-500/40 rounded-md font-mono overflow-hidden">
          <TabsTrigger 
            value="configuration" 
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 data-[state=active]:shadow-[0_0_10px_rgba(0,255,0,0.2)] hover:text-green-500 text-green-500/70 py-3 border-r border-green-500/30"
          >
            CONFIG
          </TabsTrigger>
          <TabsTrigger 
            value="patterns" 
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 data-[state=active]:shadow-[0_0_10px_rgba(0,255,0,0.2)] hover:text-green-500 text-green-500/70 py-3"
          >
            MATRIX_PATTERNS
          </TabsTrigger>
        </TabsList>
        <div className="border-2 border-t-0 border-green-500/40 bg-black/80 rounded-b-md shadow-[0_0_15px_rgba(0,255,0,0.15)] p-0.5">
          <div className={activeTab === "configuration" ? "block p-4" : "hidden"}>
            <ConfigurationForm />
          </div>
          <div className={activeTab === "patterns" ? "block p-4" : "hidden"}>
            <PatternSelector />
          </div>
        </div>
      </Tabs>
    </div>
  )
} 