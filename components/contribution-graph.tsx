"use client"

import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCommitStore } from "@/lib/commit-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Contribution levels with corresponding colors (Cyberpunk colors)
const CONTRIBUTION_LEVELS = [
  { level: 0, color: "#090909" },
  { level: 1, color: "#003b00" },
  { level: 2, color: "#008000" },
  { level: 3, color: "#00ff00" },
  { level: 4, color: "#00ff80" },
]

// Months to display
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Days of the week to display
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Available years
const YEARS = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

// Define the cell data interface for TypeScript
interface CellData {
  date: Date
  level: number
  month: number
  day: number
  formattedDate: string
  inYear: boolean
}

// Format date for tooltip display
const formatDate = (date: Date): string => {
  try {
    // Create a new date from the input
    const validDate = new Date(date)
    
    // Check if the date is valid
    if (isNaN(validDate.getTime())) {
      return 'Invalid Date'
    }
    
    return validDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch (err) {
    return 'Invalid Date'
  }
}

// Main ContributionGraph component with client-side only rendering
export default function ContributionGraph() {
  const { toast } = useToast()
  const { commitData, setCommitData, selectedYear, setSelectedYear } = useCommitStore()
  
  const [isClient, setIsClient] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [totalCommits, setTotalCommits] = useState(0)
  const graphRef = useRef<HTMLDivElement>(null)

  // Simple client-side initialization
  useEffect(() => {
    setIsClient(true)
    initGrid()
  }, [selectedYear])

  // Update commit count when data changes
  useEffect(() => {
    if (isClient && commitData.length > 0) {
      const total = commitData.reduce((sum, cell) => sum + (cell.inYear ? cell.level : 0), 0)
      setTotalCommits(total)
    }
  }, [commitData, isClient])

  // Initialize grid data
  const initGrid = () => {
    if (!isClient) return
    
    // Create a date for Jan 1 of the selected year
    const startDate = new Date(selectedYear, 0, 1)
    const firstDayOfWeek = startDate.getDay()
    
    // Start from the nearest Sunday before or on January 1st
    const firstDay = new Date(startDate)
    if (firstDayOfWeek !== 0) {
      firstDay.setDate(firstDay.getDate() - firstDayOfWeek)
    }
    
    // Determine if it's a leap year
    const isLeapYear = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0)
    const daysInYear = isLeapYear ? 366 : 365
    
    // Calculate total weeks needed (may exceed 52 weeks for a full year display)
    const totalWeeks = Math.ceil((daysInYear + firstDayOfWeek) / 7)
    
    // Create all the cells for the grid
    const cells: CellData[] = []
    const currentDate = new Date(firstDay)
    
    for (let i = 0; i < totalWeeks * 7; i++) {
      cells.push({
        date: new Date(currentDate.getTime()),
        level: 0,
        month: currentDate.getMonth(),
        day: currentDate.getDay(),
        formattedDate: currentDate.toISOString().split("T")[0],
        inYear: currentDate.getFullYear() === selectedYear
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    setCommitData(cells)
  }

  // Handle cell click to change level
  const handleCellClick = (index: number) => {
    if (!commitData[index]?.inYear) return
    
    const newData = [...commitData]
    newData[index].level = (newData[index].level + 1) % 5
    setCommitData(newData)
  }

  // Reset the grid
  const handleReset = () => {
    const newData = commitData.map(cell => ({ ...cell, level: 0 }))
    setCommitData(newData)
    toast({
      title: "Graph Reset",
      description: "Contribution graph has been reset",
    })
  }

  // Export the graph as an image
  const handleExport = async () => {
    if (!graphRef.current) return

    setIsExporting(true)
    try {
      // Import html2canvas dynamically to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(graphRef.current, {
        backgroundColor: "black",
        scale: 2,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `github-matrix-${selectedYear}.png`
      link.click()

      toast({
        title: "Export Success",
        description: "Contribution graph saved as image",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export contribution graph",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Show loading state if not client-side yet
  if (!isClient) {
    return (
      <div className="space-y-4 relative backdrop-blur-sm border border-green-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <div className="h-64 flex items-center justify-center">
          <div className="text-green-500/50 font-mono text-sm">Loading contribution graph...</div>
        </div>
      </div>
    )
  }

  // Calculate number of days in the year
  const isLeapYear = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0)
  const daysInYear = isLeapYear ? 366 : 365

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-green-500/20 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-green-500 font-mono text-lg tracking-widest">
            GITHUB_MATRIX_<span className="text-green-300">{selectedYear}</span>
            {selectedYear > new Date().getFullYear() && 
              <span className="text-xs text-yellow-400 ml-2 font-bold">[FUTURE_TIMELINE]</span>
            }
          </h2>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-green-500 font-mono text-sm hidden sm:block">
            <span className="text-green-500/60">COMMITS:</span> {totalCommits}
          </div>
          <Select 
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-32 bg-black/70 border-green-500/50 text-green-500 font-mono hover:border-green-500 transition-colors">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-black border-green-500/50 text-green-500 font-mono">
              {YEARS.map((year) => (
                <SelectItem 
                  key={`year-${year}`}
                  value={year.toString()} 
                  className="text-green-500 hover:bg-green-500/20 focus:bg-green-500/20 focus:text-green-300"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-green-500 font-mono text-sm sm:hidden ml-auto">
            <span className="text-green-500/60">COMMITS:</span> {totalCommits}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div ref={graphRef} className="relative border border-green-500/20 rounded p-4 bg-black/40">
        {/* Future year notice */}
        {selectedYear > new Date().getFullYear() && (
          <div className="mb-3 text-xs text-yellow-400/90 font-mono bg-yellow-400/10 border border-yellow-400/30 p-2 rounded">
            <span className="font-bold">FUTURE_TIMELINE:</span> You&apos;re viewing a future year. All days are available for creating contributions.
          </div>
        )}
        
        {/* Grid content */}
        <div className="overflow-x-auto">
          <div className="flex min-w-[750px]">
            {/* Days of week labels */}
            <div className="pr-2 pt-4">
              {DAYS.map((day) => (
                <div key={`day-${day}`} className="h-[10px] text-[9px] sm:text-xs text-green-500/60 font-mono py-[2px] mb-[1px] leading-none">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Main grid content */}
            <div className="w-full relative">
              {/* Month labels - simple evenly spaced version */}
              <div className="flex mb-1">
                {MONTHS.map((month, idx) => (
                  <div 
                    key={`month-${month}`} 
                    className="text-center text-[9px] sm:text-xs text-green-500/60 font-mono"
                    style={{ width: `${100/12}%` }} 
                  >
                    {month}
                  </div>
                ))}
              </div>
              
              {/* Simplified grid layout */}
              <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
                {commitData.map((cell, index) => {
                  const isInYear = cell.inYear
                  const level = isInYear ? cell.level : 0
                  const color = CONTRIBUTION_LEVELS[level]?.color || CONTRIBUTION_LEVELS[0].color
                  
                  return (
                    <Tooltip key={`tooltip-${index}`}>
                      <TooltipTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => handleCellClick(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleCellClick(index)
                            }
                          }}
                          className={`
                            inline-block w-[10px] h-[10px] rounded-sm p-0 border-0 m-0
                            ${isInYear ? "cursor-pointer hover:ring-1 hover:ring-green-500/50" : "opacity-30 pointer-events-none"}
                            ${level > 0 ? "animate-pulse-slow" : ""}
                          `}
                          style={{ backgroundColor: color }}
                          aria-label={formatDate(cell.date)}
                          aria-disabled={!isInYear}
                        />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="bg-black/90 border border-green-500/40 text-green-400 font-mono text-xs p-2"
                      >
                        <div className="flex flex-col gap-1">
                          <div>{formatDate(cell.date)}</div>
                          <div className="text-green-300">
                            {level === 0 ? "No contributions" : `${level} contribution${level !== 1 ? 's' : ''}`}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 mt-3 text-[10px] sm:text-xs font-mono text-green-500/60">
            <span>Less</span>
            {CONTRIBUTION_LEVELS.map((level, idx) => (
              <div 
                key={`legend-${idx}`}
                className="w-[10px] h-[10px] rounded-sm"
                style={{ backgroundColor: level.color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
      
      {/* Footer section */}
      <div className="flex justify-between items-center pt-2 border-t border-green-500/20">
        <div className="space-y-1">
          <div className="font-mono text-xs text-green-500/70">
            <span className="text-green-500/90 font-semibold">{totalCommits}</span> COMMIT{totalCommits !== 1 ? "S" : ""} SELECTED
          </div>
          {totalCommits > 0 && (
            <div className="font-mono text-[10px] text-green-500/50">
              Tip: Click on cells to increase intensity
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isExporting || totalCommits === 0}
            className="text-green-500 border-green-500/60 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500 transition-colors focus:ring-1 focus:ring-green-500/50 focus:ring-offset-0"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-green-500 border-green-500/60 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500 transition-colors focus:ring-1 focus:ring-green-500/50 focus:ring-offset-0"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>
    </div>
  )
}