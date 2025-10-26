"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Photo {
  id: string
  file_path: string
  file_url: string
  created_at: string
  device_type: string
}

export function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadPhoto = async (file: File): Promise<Photo | null> => {
    try {
      setIsUploading(true)
      setError(null)

      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `photos/${fileName}`

      console.log("[v0] Subiendo foto:", fileName)

      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("photos").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        console.error("[v0] Error al subir archivo:", uploadError)
        throw uploadError
      }

      console.log("[v0] Archivo subido exitosamente:", uploadData)

      // Obtener URL pública del archivo
      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(filePath)

      console.log("[v0] URL pública generada:", publicUrl)

      // Detectar tipo de dispositivo
      const deviceType = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent) ? "mobile" : "desktop"

      // Guardar metadatos en la base de datos
      const { data: photoData, error: dbError } = await supabase
        .from("photos")
        .insert({
          file_path: filePath,
          file_url: publicUrl,
          device_type: deviceType,
        })
        .select()
        .single()

      if (dbError) {
        console.error("[v0] Error al guardar en base de datos:", dbError)
        throw dbError
      }

      console.log("[v0] Metadatos guardados en DB:", photoData)

      setIsUploading(false)
      return photoData as Photo
    } catch (err) {
      console.error("[v0] Error en uploadPhoto:", err)
      setError(err instanceof Error ? err.message : "Error al subir la foto")
      setIsUploading(false)
      return null
    }
  }

  return {
    uploadPhoto,
    isUploading,
    error,
  }
}
