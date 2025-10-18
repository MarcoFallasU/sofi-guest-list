"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: number
  title: string
  url: string
}

interface PhotoCarouselProps {
  images: GalleryImage[]
}

export function PhotoCarousel({ images }: PhotoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Mostrar/ocultar pista (flecha) según overflow y scroll
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const decide = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth
      // La mostramos solo si hay overflow y estamos al inicio
      setShowHint(hasOverflow && el.scrollLeft < 8)
    }

    decide()
    const onScroll = () => {
      if (el.scrollLeft > 8) setShowHint(false)
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    // auto-ocultar a los 5s por si no se mueve
    const t = setTimeout(() => setShowHint(false), 5000)

    return () => {
      el.removeEventListener("scroll", onScroll)
      clearTimeout(t)
    }
  }, [images])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    setShowHint(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex gap-6 overflow-x-auto scrollbar-hide py-8 scroll-smooth select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 w-80">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.title || `Foto ${image.id}`}
              className="w-full h-full object-cover rounded-lg shadow-lg pointer-events-none"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {showHint && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
          {/* flecha */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <div className="flex items-center gap-2 opacity-40 animate-pulse">
              <span className="text-sm font-medium text-foreground/70 hidden sm:inline">desliza</span>
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
