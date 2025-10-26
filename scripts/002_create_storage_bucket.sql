-- Crear bucket de almacenamiento para las fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de almacenamiento: permitir a todos subir y ver fotos
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'photos');
