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

            {/* Texto minimalista */}
            <div className="space-y-4">
              <h1 className="text-2xl font-extralight text-white tracking-[0.4em] uppercase">PhotoSync</h1>
              <div className="h-px w-16 mx-auto bg-white/20"></div>
              <p className="text-white/40 text-xs font-light tracking-[0.4em] uppercase">Novack</p>
            </div>
          </div>
        </div>

        {/* Botón minimalista + */}
        <div className="pb-12 flex justify-center">
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.capture = 'environment'
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) handlePhotoCapture(file)
              }
              input.click()
            }}
            disabled={isUploading}
            className="w-16 h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-extralight hover:bg-white/10 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              '+'
            )}
          </button>
        </div>
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