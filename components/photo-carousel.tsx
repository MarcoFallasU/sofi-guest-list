"use client"

import { useRef, useState } from "react"
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const stopDragging = () => setIsDragging(false)

  return (
    <div className="w-full">
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={cn(
          "flex gap-6 overflow-x-auto py-8 scroll-smooth select-none",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          " [&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 w-80">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.title || `Foto ${image.id}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
