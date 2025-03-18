"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCommitStore } from "@/lib/commit-store"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { CommitCell } from "@/lib/types"
import { CircuitBoard, Zap, Heart, AlignLeft, TrendingUp, Grid, Info, BarChart, Target, GitBranch, Calendar } from "lucide-react"

// Pattern templates with cyberpunk icons and names
const PATTERNS = {
  random: { name: "QUANTUM_NOISE", icon: <Zap className="h-4 w-4" /> },
  wave: { name: "SINE_WAVE", icon: <TrendingUp className="h-4 w-4" /> },
  heart: { name: "NEURAL_PULSE", icon: <Heart className="h-4 w-4" /> },
  name: { name: "CODE_SIGN", icon: <AlignLeft className="h-4 w-4" /> },
  diagonal: { name: "VECTOR_STRIPE", icon: <TrendingUp className="h-4 w-4 transform rotate-45" /> },
  checkerboard: { name: "GRID_MATRIX", icon: <Grid className="h-4 w-4" /> },
  pyramid: { name: "DATA_PYRAMID", icon: <Target className="h-4 w-4" /> },
  circuit: { name: "CIRCUIT_PATH", icon: <GitBranch className="h-4 w-4" /> },
  calendar: { name: "TIME_BLOCKS", icon: <Calendar className="h-4 w-4" /> },
  histogram: { name: "DATA_FLOW", icon: <BarChart className="h-4 w-4" /> },
}

export default function PatternSelector() {
  const { toast } = useToast()
  const { commitData, setCommitData, selectedYear } = useCommitStore()
  const [intensity, setIntensity] = useState([2])
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply pattern only when the component is mounted on client
  const applyPattern = (pattern: string) => {
    if (!mounted) return
    
    if (commitData.length === 0) {
    toast({
        title: "No Data",
        description: "Please wait for the year data to load",
        variant: "destructive"
      })
      return
    }
    
    setSelectedPattern(pattern)

    switch (pattern) {
      case "random":
        applyRandomPattern()
        break
      case "wave":
        applyWavePattern()
        break
      case "heart":
        applyHeartPattern()
        break
      case "name":
        applyNamePattern()
        break
      case "diagonal":
        applyDiagonalPattern()
        break
      case "checkerboard":
        applyCheckerboardPattern()
        break
      case "pyramid":
        applyPyramidPattern()
        break
      case "circuit":
        applyCircuitPattern()
        break
      case "calendar":
        applyCalendarPattern()
        break
      case "histogram":
        applyHistogramPattern()
        break
    }
  }

  // Apply random distribution pattern
  const applyRandomPattern = () => {
    if (!mounted) return
    
    // Copy the current data
    let newData = [...commitData]
    
    // Apply random intensity based on the slider
    const maxIntensity = intensity[0]
    
    // Loop through cells and apply random intensity to in-year cells
    newData = newData.map(cell => {
      if (!cell.inYear) return cell // Skip cells outside the year
      
      // Random intensity from 0 to maxIntensity
      const randomLevel = Math.floor(Math.random() * (maxIntensity + 1))
      return { ...cell, level: randomLevel }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "QUANTUM_NOISE pattern has been applied",
    })
  }

  // Apply wave pattern
  const applyWavePattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Find the middle of the grid (7 days in a week)
    const numWeeks = 53 // Standard GitHub year has up to 53 weeks
    
    // Apply a sine wave pattern horizontally
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const weekIndex = Math.floor(index / 7)
      const dayIndex = index % 7
      
      // Create a sine wave based on the week position
      const frequency = 3 // Adjust for number of waves
      const wave = Math.sin((weekIndex / numWeeks) * Math.PI * frequency)
      const normalized = (wave + 1) / 2 // Normalize to 0-1 range
      
      // Apply the intensity based on the normalized value and max intensity
      const level = Math.floor(normalized * maxIntensity)
      
      return { ...cell, level }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "SINE_WAVE pattern has been applied",
    })
  }

  // Apply heart pattern
  const applyHeartPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Heart shape coordinates (simplified for a 7x10 grid)
    // Positions relative to the middle of the grid
    const heartPattern = [
      [1, 0], [2, 0], [4, 0], [5, 0],           // Top of heart
      [0, 1], [3, 1], [6, 1],                    // Second row
      [0, 2], [6, 2],                            // Third row
      [1, 3], [5, 3],                            // Fourth row
      [2, 4], [4, 4],                            // Fifth row
      [3, 5],                                    // Bottom tip
    ]
    
    // Determine the heart pattern's center position
    const offsetWeek = 26  // Center week (horizontal)
    const offsetDay = 3    // Center day (vertical)
    
    // First, reset all cells
    newData = newData.map(cell => ({ ...cell, level: 0 }))
    
    // Apply the heart pattern
    heartPattern.forEach(([relY, relX]) => {
      // Calculate the absolute position in the grid
      const weekIndex = offsetWeek + relX - 3
      const dayIndex = offsetDay + relY - 3
      
      // Calculate the index in the flat array
      const index = (weekIndex * 7) + dayIndex
      
      // Set the cell if it's within bounds and in the selected year
      if (index >= 0 && index < newData.length && newData[index].inYear) {
        newData[index].level = maxIntensity
      }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "NEURAL_PULSE pattern has been applied",
    })
  }

  // Apply name pattern (with "DEV" as the default text)
  const applyNamePattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Define a simple bitmap font for "DEV"
    const text = "DEV"
    const charPatterns: Record<string, number[][]> = {
      'D': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
      ],
      'E': [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
      ],
      'V': [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
    }
    
    // First, reset all cells
    newData = newData.map(cell => ({ ...cell, level: 0 }))
    
    // Apply the text pattern
    let offsetWeek = 15 // Starting week (horizontal position)
    
    // Draw each character
    for (const char of text) {
      const pattern = charPatterns[char]
      if (!pattern) continue
      
      // Draw the character pattern
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          if (pattern[y][x]) {
            // Calculate the index in the flat array
            const index = ((offsetWeek + x) * 7) + (y + 1) // +1 to move down slightly
            
            // Set the cell if it's within bounds and in the selected year
            if (index >= 0 && index < newData.length && newData[index].inYear) {
              newData[index].level = maxIntensity
            }
          }
        }
      }
      
      // Move to the next character position
      offsetWeek += pattern[0].length + 2 // 2 space gap between characters
    }
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "CODE_SIGN pattern has been applied",
    })
  }

  // Apply diagonal stripes pattern
  const applyDiagonalPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Apply diagonal stripes
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const weekIndex = Math.floor(index / 7)
      const dayIndex = index % 7
      
      // Create diagonal stripes with a period of 7
      const diagonal = (weekIndex + dayIndex) % 7
      
      // Assign intensity based on position in the stripe
      let level = 0
      if (diagonal < 2) {
        level = maxIntensity
      } else if (diagonal < 3) {
        level = Math.max(1, Math.floor(maxIntensity * 0.7))
      }
      
      return { ...cell, level }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "VECTOR_STRIPE pattern has been applied",
    })
  }

  // Apply checkerboard pattern
  const applyCheckerboardPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Apply checkerboard
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const weekIndex = Math.floor(index / 7)
      const dayIndex = index % 7
      
      // Basic checkerboard
      const isEvenWeek = weekIndex % 2 === 0
      const isEvenDay = dayIndex % 2 === 0
      
      // If both even or both odd, set to max intensity, otherwise 0
      const level = (isEvenWeek === isEvenDay) ? maxIntensity : 0
      
      return { ...cell, level }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "GRID_MATRIX pattern has been applied",
    })
  }

  // Apply pyramid pattern
  const applyPyramidPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Find the middle of the grid
    const totalWeeks = 53
    const midWeek = Math.floor(totalWeeks / 2)
    const midDay = 3 // Middle day of the week (Wednesday)
    
    // Apply a pyramidal/triangular pattern centered in the grid
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const weekIndex = Math.floor(index / 7)
      const dayIndex = index % 7
      
      // Calculate distance from the middle (normalized to 0-1)
      const weekDistance = Math.abs(weekIndex - midWeek) / midWeek
      const dayDistance = Math.abs(dayIndex - midDay) / midDay
      
      // Combined distance (closer to center means lower value)
      const distance = Math.sqrt(weekDistance * weekDistance + dayDistance * dayDistance)
      
      // Invert the distance and scale to the intensity range
      const level = Math.max(0, Math.floor(maxIntensity * (1 - Math.min(1, distance))))
      
      return { ...cell, level }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "DATA_PYRAMID pattern has been applied",
    })
  }

  // Apply circuit board pattern
  const applyCircuitPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // First, reset all cells
    newData = newData.map(cell => ({ ...cell, level: 0 }))
    
    // Create "circuit traces" horizontally
    const numberOfTraces = 3
    const traceWeeks = [10, 25, 40] // Starting weeks for each trace
    
    traceWeeks.forEach(startWeek => {
      // Horizontal trace
      for (let week = startWeek; week < startWeek + 10; week++) {
        for (let day = 2; day < 4; day++) { // Make the trace 2 cells thick
          const index = (week * 7) + day
          if (index < newData.length && newData[index].inYear) {
            newData[index].level = maxIntensity
          }
        }
      }
      
      // Vertical branch from the trace
      const verticalOffset = Math.floor(Math.random() * 7)
      for (let day = 0; day < 7; day++) {
        const index = ((startWeek + verticalOffset) * 7) + day
        if (index < newData.length && newData[index].inYear) {
          newData[index].level = maxIntensity
        }
      }
      
      // Add "components" (small blocks) along the traces
      for (let i = 0; i < 3; i++) {
        const componentWeek = startWeek + Math.floor(Math.random() * 10)
        const componentDay = Math.floor(Math.random() * 6)
        
        // 2x2 component
        for (let w = 0; w < 2; w++) {
          for (let d = 0; d < 2; d++) {
            const index = ((componentWeek + w) * 7) + (componentDay + d)
            if (index < newData.length && newData[index].inYear) {
              newData[index].level = maxIntensity
            }
          }
        }
      }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "CIRCUIT_PATH pattern has been applied",
    })
  }

  // Apply calendar pattern with highlights for important days
  const applyCalendarPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Highlight specific days (weekends, midweek)
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const dayIndex = index % 7
      
      // Weekend cells (Saturday and Sunday)
      if (dayIndex === 0 || dayIndex === 6) {
        return { ...cell, level: maxIntensity }
      }
      
      // Midweek (Wednesday)
      if (dayIndex === 3) {
        return { ...cell, level: Math.max(1, Math.floor(maxIntensity * 0.7)) }
      }
      
      // Other days
      return { ...cell, level: 0 }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied", 
      description: "TIME_BLOCKS pattern has been applied",
    })
  }

  // Apply histogram pattern (increasing intensity over the year)
  const applyHistogramPattern = () => {
    if (!mounted) return
    
    const maxIntensity = intensity[0]
    let newData = [...commitData]
    
    // Highlight specific days (weekends, midweek)
    newData = newData.map((cell, index) => {
      if (!cell.inYear) return cell
      
      const weekIndex = Math.floor(index / 7)
      const numWeeks = 52 // Approximating a year
      
      // Calculate level based on progression through the year
      const progressionRatio = weekIndex / numWeeks
      const level = Math.floor(progressionRatio * maxIntensity)
      
      return { ...cell, level }
    })
    
    setCommitData(newData)
    
    toast({
      title: "Pattern Applied",
      description: "DATA_FLOW pattern has been applied",
    })
  }

  if (!mounted) {
    return (
      <div className="flex justify-center items-center p-4 h-32">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
          <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-green-500 font-mono text-sm pb-1">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-green-500/70" />
              <span>INTENSITY_LEVEL: {intensity}</span>
            </div>
          </Label>
          <div className="text-xs text-green-500/70 font-mono">MAX 4</div>
        </div>
        <Slider
          defaultValue={[2]}
          max={4}
          step={1}
          value={intensity}
          onValueChange={setIntensity}
          className="[&>span:nth-child(3)]:bg-green-500"
        />
          </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(PATTERNS).map(([key, pattern]) => (
              <Button
                key={key}
                onClick={() => applyPattern(key)}
            variant="outline"
            className={`font-mono text-xs border-green-500/60 text-green-500 hover:bg-green-500/20 hover:text-green-300 justify-start ${
              selectedPattern === key ? "bg-green-500/20 border-green-500" : ""
            }`}
              >
            <span className="mr-2">{pattern.icon}</span>
            {pattern.name}
              </Button>
            ))}
      </div>
    </div>
  )
}

