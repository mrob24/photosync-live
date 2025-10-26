"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Photo } from "@/hooks/use-photo-upload"

export default function CollagePage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadPhotos = async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al cargar fotos:", error)
      } else {
        setPhotos(data || [])
      }
      setIsLoading(false)
    }

    loadPhotos()
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel("collage-photos-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
        },
        (payload) => {
          const newPhoto = payload.new as Photo
          setPhotos((current) => [newPhoto, ...current])
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "photos",
        },
        (payload) => {
          setPhotos((current) => current.filter((photo) => photo.id !== (payload.old as Photo).id))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Auto-scroll lento
  useEffect(() => {
    if (!autoScroll) return

    const pixelsPerSecond = 10 // Ajusta este valor: 10=muy lento, 30=lento, 50=medio
    let lastTime = performance.now()
    let animationFrameId: number

    const scroll = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000 // convertir a segundos
      const scrollAmount = pixelsPerSecond * deltaTime
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      
      if (window.scrollY >= maxScroll - 10) {
        // Volver arriba suavemente cuando llega al final
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
          lastTime = performance.now()
          animationFrameId = requestAnimationFrame(scroll)
        }, 2000) // Pausa de 2 segundos antes de reiniciar
      } else {
        window.scrollBy(0, scrollAmount)
        lastTime = currentTime
        animationFrameId = requestAnimationFrame(scroll)
      }
    }

    animationFrameId = requestAnimationFrame(scroll)

    // Pausar auto-scroll si el usuario interactúa
    const handleInteraction = () => {
      setAutoScroll(false)
      setTimeout(() => setAutoScroll(true), 5000) // Reanudar después de 5 segundos
    }

    window.addEventListener('wheel', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('wheel', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [autoScroll])

  // Generar tamaños dinámicos para el collage
  const getPhotoLayout = (index: number) => {
    const patterns = [
      { span: "col-span-2 row-span-2", height: "h-[400px]" }, // Grande
      { span: "col-span-1 row-span-1", height: "h-[195px]" }, // Pequeño
      { span: "col-span-1 row-span-1", height: "h-[195px]" }, // Pequeño
      { span: "col-span-1 row-span-2", height: "h-[400px]" }, // Alto
      { span: "col-span-2 row-span-1", height: "h-[195px]" }, // Ancho
      { span: "col-span-1 row-span-1", height: "h-[195px]" }, // Pequeño
    ]
    
    return patterns[index % patterns.length]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-solid border-white/20 border-t-white mb-4"></div>
          <p className="text-white/60 text-lg font-light tracking-wider">Cargando...</p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-8">
          <div className="text-7xl mb-6 opacity-40">📸</div>
          <p className="text-white/40 text-xl font-light tracking-wider">No hay fotos aún...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 h-16 flex items-center shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
            </div>
          </div>
        </div>

        {/* Collage Masonry Grid */}
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="grid grid-cols-4 auto-rows-auto gap-3">
            {photos.map((photo, idx) => {
              const layout = getPhotoLayout(idx)
              
              return (
                <div
                  key={photo.id}
                  className={`${layout.span} ${layout.height} group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10`}
                  style={{
                    animationDelay: `${idx * 80}ms`,
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.file_url || "/placeholder.svg"}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradiente siempre visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-light mb-1 drop-shadow-lg">
                        {new Date(photo.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-white/70 text-xs drop-shadow-lg">
                        {new Date(photo.created_at).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Borde sutil */}
                  <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal foto seleccionada */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/96 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-6xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.file_url || "/placeholder.svg"}
              alt="Foto ampliada"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
              <p className="text-white text-xl font-light mb-2">
                {new Date(selectedPhoto.created_at).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-white/60">
                {new Date(selectedPhoto.created_at).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .grid > div {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </>
  )
}