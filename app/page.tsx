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
      <div className="h-screen bg-black flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Mensaje de éxito minimalista */}
        {uploadSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-6 py-3 rounded-full animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs font-light tracking-wide">Subida exitosa</span>
            </div>
          </div>
        )}

        {/* Mensaje de error minimalista */}
        {error && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 px-6 py-3 rounded-full animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-xs font-light tracking-wide">{error}</span>
          </div>
        )}

        {/* Contenido central ultra minimalista */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
          <div className="text-center space-y-12 animate-in fade-in duration-1000">
            {/* Icono simple */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border border-white/10">
              <Camera className="w-10 h-10 text-white/80" strokeWidth={1} />
            </div>
            
          </div>
        </div>

        {/* Botón de cámara */}
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