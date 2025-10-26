"use client"

import { useState } from "react"
import { CameraCapture } from "@/components/camera-capture"
import { PhotoGallery } from "@/components/photo-gallery"
import { usePhotoUpload } from "@/hooks/use-photo-upload"
import { Monitor, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Home() {
  const { uploadPhoto, isUploading, error } = usePhotoUpload()
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Detectar si es dispositivo móvil
  const isMobile = typeof window !== "undefined" && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)

  // Manejar captura de foto
  const handlePhotoCapture = async (file: File) => {
    const result = await uploadPhoto(file)
    if (result) {
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    }
  }

  if (isMobile) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col relative overflow-hidden">
        {/* Efecto de fondo animado */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)] animate-pulse"></div>

        {/* Mensaje de éxito flotante */}
        {uploadSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-light tracking-wider">Foto subida exitosamente</span>
            </div>
          </div>
        )}

        {/* Mensaje de error flotante */}
        {error && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-200 px-8 py-4 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-light tracking-wider">{error}</span>
            </div>
          </div>
        )}

        {/* Contenido central */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            {/* Icono de cámara con efecto glow */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
                <Camera className="w-20 h-20 text-white/90" strokeWidth={1.5} />
              </div>
            </div>

            {/* Título y subtítulo con tipografía elegante */}
            <div className="space-y-3">
              <h1 className="text-4xl font-extralight text-white tracking-[0.2em] uppercase">PhotoSync</h1>
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <p className="text-white/50 text-sm font-light tracking-[0.3em] uppercase">Galería Novack</p>
            </div>
          </div>
        </div>

        {/* Botones flotantes abajo */}
        <CameraCapture onPhotoCapture={handlePhotoCapture} isUploading={isUploading} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600 p-2">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novack Gallery</h1>
                <p className="text-sm text-gray-600">Sincronización de fotos en tiempo real</p>
              </div>
            </div>
            <a
              href="/obs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Abrir Vista OBS
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Indicador de tipo de dispositivo */}
        <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Modo Escritorio</p>
              <p className="text-sm text-blue-700">Las fotos aparecerán aquí en tiempo real</p>
            </div>
          </div>
        </Card>

        {/* Mensaje de éxito */}
        {uploadSuccess && (
          <Card className="mb-6 p-4 bg-green-50 border-green-200">
            <p className="text-green-800 font-medium">Foto subida exitosamente</p>
          </Card>
        )}

        {/* Mensaje de error */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <p className="text-red-800 font-medium">{error}</p>
          </Card>
        )}

        {/* Galería de fotos */}
        <PhotoGallery />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>PhotoSync Live - Sincronización en tiempo real con Supabase</p>
        </div>
      </footer>
    </div>
  )
}
