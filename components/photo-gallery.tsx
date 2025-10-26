"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ImageIcon, Trash2, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Photo } from "@/hooks/use-photo-upload"

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Cargar fotos iniciales
  useEffect(() => {
    const loadPhotos = async () => {
      console.log("[v0] Cargando fotos iniciales...")
      const { data, error } = await supabase.from("photos").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error al cargar fotos:", error)
      } else {
        console.log("[v0] Fotos cargadas:", data?.length)
        setPhotos(data || [])
      }
      setIsLoading(false)
    }

    loadPhotos()
  }, [supabase])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    console.log("[v0] Configurando suscripción Realtime...")

    // Crear canal de Realtime para escuchar cambios en la tabla photos
    const channel = supabase
      .channel("photos-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
        },
        (payload) => {
          console.log("[v0] Nueva foto detectada:", payload.new)
          // Agregar la nueva foto al inicio de la lista
          setPhotos((current) => [payload.new as Photo, ...current])
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
          console.log("[v0] Foto eliminada:", payload.old)
          // Remover la foto eliminada de la lista
          setPhotos((current) => current.filter((photo) => photo.id !== (payload.old as Photo).id))
        },
      )
      .subscribe((status) => {
        console.log("[v0] Estado de suscripción Realtime:", status)
      })

    // Cleanup: desuscribirse al desmontar el componente
    return () => {
      console.log("[v0] Cerrando suscripción Realtime...")
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Eliminar foto
  const deletePhoto = async (photo: Photo) => {
    try {
      console.log("[v0] Eliminando foto:", photo.id)

      // Eliminar archivo de Storage
      const { error: storageError } = await supabase.storage.from("photos").remove([photo.file_path])

      if (storageError) {
        console.error("[v0] Error al eliminar de Storage:", storageError)
        throw storageError
      }

      // Eliminar registro de la base de datos
      const { error: dbError } = await supabase.from("photos").delete().eq("id", photo.id)

      if (dbError) {
        console.error("[v0] Error al eliminar de DB:", dbError)
        throw dbError
      }

      console.log("[v0] Foto eliminada exitosamente")
    } catch (err) {
      console.error("[v0] Error al eliminar foto:", err)
      alert("Error al eliminar la foto")
    }
  }

  // Descargar foto
  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement("a")
    link.href = photo.file_url
    link.download = `photo-${photo.id}.jpg`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando fotos...</p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gray-100 p-6">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No hay fotos aún</h3>
          <p className="text-gray-600 max-w-sm">Las fotos que captures desde tu móvil aparecerán aquí en tiempo real</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Galería de Fotos</h2>
        <span className="text-sm text-gray-600">{photos.length} fotos</span>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group relative">
            {/* Imagen */}
            <div className="aspect-square relative bg-gray-100">
              <img
                src={photo.file_url || "/placeholder.svg"}
                alt={`Foto ${photo.id}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => downloadPhoto(photo)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={() => deletePhoto(photo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Información */}
            <div className="p-3 bg-white">
              <p className="text-xs text-gray-500">
                {new Date(photo.created_at).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1 capitalize">{photo.device_type}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
