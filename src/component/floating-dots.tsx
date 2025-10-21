'use client'
import { useEffect, useState } from 'react'

interface PingDot {
  top: string
  left: string
  delay: string
  duration: string
}

export default function FloatingDots() {
  const [dots, setDots] = useState<PingDot[]>([])

  useEffect(() => {
    // Only run on client
    const generateRandomDots = () => {
      return [...Array(18)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${2 + Math.random() * 2}s`,
      }))
    }

    setDots(generateRandomDots())
  }, [])

  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={`float-${i}`}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-ping"
          style={{
            top: dot.top,
            left: dot.left,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </>
  )
}
