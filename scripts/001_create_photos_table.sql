-- Crear tabla para almacenar metadatos de las fotos
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop'))
);

-- Habilitar Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: permitir a todos ver y crear fotos (app pública sin auth)
-- Si quieres agregar autenticación más adelante, puedes modificar estas políticas
CREATE POLICY "Allow anyone to view photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Allow anyone to insert photos"
  ON public.photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to delete photos"
  ON public.photos FOR DELETE
  USING (true);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON public.photos(created_at DESC);
