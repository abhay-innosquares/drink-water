"use client"

import { useEffect, useState } from "react"

interface WaterLevelProps {
  level: number
  maxLevel: number
}

export default function WaterLevel({ level, maxLevel }: WaterLevelProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0)

  useEffect(() => {
    // Animate the water level change
    const timer = setTimeout(() => {
      setAnimatedLevel(level)
    }, 100)

    return () => clearTimeout(timer)
  }, [level])

  const percentage = (animatedLevel / maxLevel) * 100

  return (
    <div className="relative w-full h-64 border-2 border-blue-400 rounded-lg overflow-hidden bg-white">
      <div
        className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-1000 ease-out"
        style={{ height: `${percentage}%` }}
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-blue-300 opacity-50"></div>
      </div>

      {/* Level markers */}
      {Array.from({ length: maxLevel }).map((_, index) => (
        <div
          key={index}
          className="absolute left-0 right-0 border-t border-dashed border-blue-200"
          style={{
            bottom: `${(index / maxLevel) * 100}%`,
            opacity: index < animatedLevel ? 0 : 0.5,
          }}
        />
      ))}

      {/* Water drops animation */}
      {animatedLevel > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-30 animate-ping"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * (100 - percentage)}%`,
                animationDuration: `${Math.random() * 3 + 1}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

