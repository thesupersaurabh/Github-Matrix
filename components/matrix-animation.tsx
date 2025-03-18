"use client"

import { useEffect, useRef } from 'react'

export default function MatrixAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters
    const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    // Setup columns based on font size
    const fontSize = 14
    const columns = Math.ceil(canvas.width / fontSize)
    
    // Initialize drops at random positions
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height
    }

    // Matrix drawing function
    const drawMatrix = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Green text
      ctx.fillStyle = "#00ff41"
      ctx.font = `${fontSize}px monospace`
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters.charAt(Math.floor(Math.random() * characters.length))
        
        // Draw character
        const x = i * fontSize
        const y = drops[i] * 1
        
        // Add varying green intensity
        const intensity = Math.floor(Math.random() * 5) + 1
        ctx.fillStyle = `rgba(0, ${150 + intensity * 20}, ${intensity * 10}, 0.8)`
        
        ctx.fillText(char, x, y)
        
        // Move drops down
        drops[i] += 0.5
        
        // Reset drops back to top with random reset
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }
      
      requestAnimationFrame(drawMatrix)
    }
    
    // Start animation
    const animationId = requestAnimationFrame(drawMatrix)
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-10"
      aria-hidden="true"
    />
  )
} 