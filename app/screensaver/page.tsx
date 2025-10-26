"use client"

import { useEffect, useRef, useState } from "react"

export default function BouncingLogo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const [cornerHits, setCornerHits] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const logo = logoRef.current
    if (!container || !logo) return

    let x = Math.random() * (window.innerWidth - 600)
    let y = Math.random() * (window.innerHeight - 300)
    let dx = 2
    let dy = 2

    const animate = () => {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight
      const logoWidth = 600
      const logoHeight = 300

      x += dx
      y += dy

      // Check horizontal boundaries
      if (x + logoWidth >= containerWidth) {
        x = containerWidth - logoWidth
        dx = -dx
      } else if (x <= 0) {
        x = 0
        dx = -dx
      }

      // Check vertical boundaries
      if (y + logoHeight >= containerHeight) {
        y = containerHeight - logoHeight
        dy = -dy
      } else if (y <= 0) {
        y = 0
        dy = -dy
      }

      // Check if it hit a corner (both edges at same time)
      if ((x <= 0 || x + logoWidth >= containerWidth) && (y <= 0 || y + logoHeight >= containerHeight)) {
        setCornerHits((prev) => prev + 1)
      }

      logo.style.transform = `translate(${x}px, ${y}px)`

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div ref={containerRef} className="relative w-screen h-screen bg-black overflow-hidden">
      <div ref={logoRef} className="absolute w-[600px] h-[300px] will-change-transform">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cJIC4Lm1mpMz4XpwPo9Rbz3KrXIo9B.png"
          alt="Novack Logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>

  )
}
