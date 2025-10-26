"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Photo } from "@/hooks/use-photo-upload"
import type { RealtimeChannel } from "@supabase/supabase-js"

/**
 * Hook personalizado para gestionar fotos con sincronización en tiempo real
 * Escucha cambios en la tabla photos y actualiza el estado automáticamente
 */
export function useRealtimePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtimeSubscription = async () => {
      try {
        // Cargar fotos iniciales
        console.log("[v0] Cargando fotos iniciales...")
        const { data, error: fetchError } = await supabase
          .from("photos")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError

        console.log("[v0] Fotos cargadas:", data?.length)
        setPhotos(data || [])
        setIsLoading(false)

        // Configurar suscripción Realtime
        console.log("[v0] Configurando Realtime...")
        channel = supabase
          .channel("photos-realtime")
          .on(
            "postgres_changes",
            {
              event: "*", // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
              schema: "public",
              table: "photos",
            },
            (payload) => {
              console.log("[v0] Cambio detectado en Realtime:", payload)

              if (payload.eventType === "INSERT") {
                // Nueva foto agregada
                setPhotos((current) => [payload.new as Photo, ...current])
              } else if (payload.eventType === "DELETE") {
                // Foto eliminada
                setPhotos((current) => current.filter((photo) => photo.id !== (payload.old as Photo).id))
              } else if (payload.eventType === "UPDATE") {
                // Foto actualizada
                setPhotos((current) =>
                  current.map((photo) => (photo.id === (payload.new as Photo).id ? (payload.new as Photo) : photo)),
                )
              }
            },
          )
          .subscribe((status) => {
            console.log("[v0] Estado de Realtime:", status)
          })
      } catch (err) {
        console.error("[v0] Error al configurar Realtime:", err)
        setError(err instanceof Error ? err.message : "Error al cargar fotos")
        setIsLoading(false)
      }
    }

    setupRealtimeSubscription()

    // Cleanup
    return () => {
      if (channel) {
        console.log("[v0] Limpiando suscripción Realtime...")
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  return {
    photos,
    isLoading,
    error,
  }
}
