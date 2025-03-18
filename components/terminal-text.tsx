"use client"

import { useState, useEffect } from 'react'

interface TerminalTextProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  blinkCursor?: boolean;
  onComplete?: () => void;
}

export default function TerminalText({
  text,
  className = "",
  speed = 50,
  startDelay = 1000,
  blinkCursor = true,
  onComplete
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Start delay
    timeout = setTimeout(() => {
      setIsTyping(true)
      let currentIndex = 0
      
      // Type each character
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
          if (onComplete) onComplete()
        }
      }, speed)
      
      return () => clearInterval(typingInterval)
    }, startDelay)
    
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay, onComplete])
  
  // Blinking cursor effect
  useEffect(() => {
    if (!blinkCursor) return
    
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)
    
    return () => clearInterval(cursorInterval)
  }, [blinkCursor])

  return (
    <div className={`font-mono ${className}`}>
      {displayedText}
      {(isTyping || blinkCursor) && (
        <span 
          className={`inline-block w-2 h-5 ml-1 bg-green-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </div>
  )
} 