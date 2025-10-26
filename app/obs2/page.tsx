"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Photo } from "@/hooks/use-photo-upload"

export default function OBSPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [photoOrientations, setPhotoOrientations] = useState<{ [key: string]: "portrait" | "landscape" }>({})
  const supabase = createClient()

  const detectOrientation = (url: string) => {
    const img = new Image()
    img.onload = () => {
      const orientation = img.height > img.width ? "portrait" : "landscape"
      setPhotoOrientations((prev) => ({ ...prev, [url]: orientation }))
    }
    img.src = url
  }

  useEffect(() => {
    const loadPhotos = async () => {
      const { data, error } = await supabase.from("photos").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] OBS - Error al cargar fotos:", error)
      } else {
        const loadedPhotos = data || []
        setPhotos(loadedPhotos)
        loadedPhotos.forEach((photo) => {
          if (photo.file_url) detectOrientation(photo.file_url)
        })
      }
      setIsLoading(false)
    }

    loadPhotos()
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel("obs-photos-changes")
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
          if (newPhoto.file_url) detectOrientation(newPhoto.file_url)
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

  useEffect(() => {
    if (photos.length <= 1) return

    const interval = setInterval(() => {
      const next = (currentIndex + 1) % photos.length
      setNextIndex(next)
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentIndex(next)
        setIsTransitioning(false)
      }, 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [photos.length, currentIndex])

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
          <p className="text-white/40 text-xl font-light tracking-wider">Esperando fotos...</p>
        </div>
      </div>
    )
  }

  const currentPhoto = photos[currentIndex]
  const nextPhoto = photos[nextIndex]

  const currentOrientation = currentPhoto?.file_url ? photoOrientations[currentPhoto.file_url] : "landscape"
  const nextOrientation = nextPhoto?.file_url ? photoOrientations[nextPhoto.file_url] : "landscape"

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${currentOrientation === "portrait" ? "animate-ken-burns-portrait" : "animate-ken-burns-landscape"}`}
          key={`current-${currentPhoto?.id}`}
        >
          <img
            src={currentPhoto?.file_url || "/placeholder.svg"}
            alt="Foto actual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 transition-opacity duration-1500 ease-in-out"
        style={{ opacity: isTransitioning ? 1 : 0 }}
      >
        <div
          className={`absolute inset-0 ${nextOrientation === "portrait" ? "animate-ken-burns-portrait" : "animate-ken-burns-landscape"}`}
          key={`next-${nextPhoto?.id}`}
        >
          <img
            src={nextPhoto?.file_url || "/placeholder.svg"}
            alt="Siguiente foto"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Overlay con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-20"></div>

      {/* Información de la foto */}
      <div className="absolute bottom-12 left-12 z-30">
        <div className="space-y-2">
          <div className="text-white/90 text-sm font-light tracking-[0.3em] uppercase">
            {new Date(currentPhoto?.created_at).toLocaleString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="text-white/60 text-xs font-light tracking-[0.2em]">
            {new Date(currentPhoto?.created_at).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Contador minimalista */}
      <div className="absolute top-12 right-12 z-30">
        <div className="text-white/50 text-sm font-light tracking-[0.3em]">
          {String(currentIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </div>
      </div>

      {/* Indicadores de progreso */}
      <div className="absolute bottom-12 right-12 z-30 flex gap-1.5">
        {photos.slice(0, Math.min(photos.length, 8)).map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 transition-all duration-300 ${
              idx === currentIndex % 8 ? "w-8 bg-white" : "w-1.5 bg-white/30"
            }`}
          ></div>
        ))}
      </div>

      <style jsx>{`
        /* Animación Ken Burns para fotos verticales con más movimiento vertical */
        @keyframes ken-burns-portrait {
          0% {
            transform: scale(1.05) translate(0, 0);
          }
          50% {
            transform: scale(1.15) translate(-1%, -6%);
          }
          100% {
            transform: scale(1.05) translate(0, -12%);
          }
        }

        /* Animación Ken Burns para fotos horizontales con poco movimiento vertical */
        @keyframes ken-burns-landscape {
          0% {
            transform: scale(1.05) translate(0, 0);
          }
          50% {
            transform: scale(1.15) translate(-2%, -1%);
          }
          100% {
            transform: scale(1.05) translate(-3%, -2%);
          }
        }

        .animate-ken-burns-portrait {
          animation: ken-burns-portrait 20s ease-in-out infinite;
        }

        .animate-ken-burns-landscape {
          animation: ken-burns-landscape 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}