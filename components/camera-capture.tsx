"use client"

import type React from "react"
import { useRef, useCallback } from "react"
import { Camera, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => Promise<void>
  isUploading: boolean
}

export function CameraCapture({ onPhotoCapture, isUploading }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        return
      }

      await onPhotoCapture(file)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [onPhotoCapture],
  )

  const handleCameraCapture = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      await onPhotoCapture(file)

      if (cameraInputRef.current) {
        cameraInputRef.current.value = ""
      }
    },
    [onPhotoCapture],
  )

  const openGallery = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const openCamera = useCallback(() => {
    cameraInputRef.current?.click()
  }, [])

  return (
    <>
      {/* Inputs ocultos */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      <div className="fixed bottom-8 left-0 right-0 px-8 flex items-center justify-between gap-4 z-40">
        {/* Botón derecho: Galería */}
        <Button
          onClick={openGallery}
          disabled={isUploading}
          size="lg"
          className="flex-1 h-16 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-white/10 disabled:opacity-30 disabled:scale-100 font-light tracking-wider"
        >
          <ImageIcon className="w-6 h-6 mr-3" strokeWidth={1.5} />
          <span className="text-sm uppercase tracking-[0.2em]">Subir foto</span>
        </Button>
      </div>

      {/* Indicador de carga mejorado */}
      {isUploading && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-sm font-light tracking-[0.2em] uppercase">Subiendo</span>
          </div>
        </div>
      )}
    </>
  )
}
