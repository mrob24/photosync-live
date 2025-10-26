<<<<<<< HEAD
# photosync-live
Photosync project for a moving gallery display
=======
# PhotoSync Live

Aplicación web responsive que permite subir fotos desde dispositivos móviles y visualizarlas en tiempo real desde cualquier dispositivo conectado. Incluye una vista especial para OBS Studio.

## Características

- **Subida de fotos desde galería**: Selecciona fotos de tu dispositivo para compartir
- **Sincronización en tiempo real**: Las fotos aparecen automáticamente en todos los dispositivos conectados
- **Galería responsive**: Visualiza las fotos en un grid adaptable
- **Vista OBS**: Modo slideshow automático perfecto para streaming y presentaciones
- **Almacenamiento en la nube**: Usa Supabase Storage para guardar las imágenes
- **Diseño limpio**: Interfaz minimalista con Tailwind CSS

## Tecnologías

- **Next.js 16** con App Router
- **React 19** con hooks personalizados
- **Supabase** para base de datos, storage y realtime
- **Tailwind CSS v4** para estilos
- **TypeScript** para type safety

## Configuración Local

### 1. Ejecutar los scripts SQL

Antes de usar la aplicación, debes ejecutar los scripts SQL para crear las tablas y el bucket de storage:

1. Ve a la sección de scripts en v0
2. Ejecuta `scripts/001_create_photos_table.sql`
3. Ejecuta `scripts/002_create_storage_bucket.sql`

### 2. Verificar variables de entorno

La aplicación usa las siguientes variables de entorno de Supabase (ya configuradas en v0):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Iniciar la aplicación

\`\`\`bash
npm install
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Cómo usar

### En dispositivos móviles:

1. Abre la aplicación en tu móvil
2. Presiona "Seleccionar Foto"
3. Elige una foto de tu galería
4. La foto se subirá automáticamente

### En computadora:

1. Abre la aplicación en tu navegador
2. Las fotos subidas aparecerán automáticamente en la galería
3. Puedes descargar o eliminar fotos desde la galería

### Vista OBS para Streaming:

1. Abre la aplicación principal
2. Haz clic en "Abrir Vista OBS" en el header
3. Se abrirá una nueva ventana con el slideshow automático
4. En OBS Studio:
   - Agrega una fuente "Navegador"
   - Pega la URL de la vista OBS (ej: `http://localhost:3000/obs`)
   - Ajusta el tamaño según necesites
5. Las fotos cambiarán automáticamente cada 5 segundos

**Personalizar tiempo de cambio:**
Edita el archivo `app/obs/page.tsx` y cambia el valor `5000` (milisegundos) en la línea del `setInterval`.

## Despliegue en Vercel

### Opción 1: Desde v0

1. Haz clic en el botón "Publish" en la esquina superior derecha
2. Sigue las instrucciones para conectar con Vercel
3. Las variables de entorno de Supabase se copiarán automáticamente

### Opción 2: Desde GitHub

1. Sube el código a un repositorio de GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Despliega

## Estructura del Proyecto

\`\`\`
photosync-live/
├── app/
│   ├── page.tsx              # Página principal
│   ├── obs/
│   │   └── page.tsx          # Vista OBS con slideshow
│   ├── layout.tsx            # Layout de la aplicación
│   └── globals.css           # Estilos globales
├── components/
│   ├── camera-capture.tsx    # Componente de subida de fotos
│   └── photo-gallery.tsx     # Componente de galería
├── hooks/
│   ├── use-photo-upload.ts   # Hook para subir fotos
│   └── use-realtime-photos.ts # Hook para sincronización realtime
├── lib/
│   └── supabase/
│       ├── client.ts         # Cliente de Supabase (browser)
│       └── server.ts         # Cliente de Supabase (server)
└── scripts/
    ├── 001_create_photos_table.sql    # Script para crear tabla
    └── 002_create_storage_bucket.sql  # Script para crear bucket
\`\`\`

## Solución de Problemas

### Las fotos no aparecen en tiempo real

1. Verifica que los scripts SQL se hayan ejecutado correctamente
2. Revisa la consola del navegador para ver logs de Realtime
3. Asegúrate de que las políticas RLS estén configuradas correctamente

### La vista OBS no muestra fotos

1. Asegúrate de que haya fotos subidas en la aplicación
2. Verifica que la URL de la vista OBS sea correcta
3. En OBS, asegúrate de que la fuente de navegador tenga acceso a internet

### Error al subir fotos

1. Verifica que el bucket "photos" exista en Supabase Storage
2. Revisa que las políticas de storage permitan uploads públicos
3. Comprueba las variables de entorno
4. Asegúrate de seleccionar archivos de imagen válidos (JPG, PNG, etc.)

## Seguridad

Esta aplicación usa políticas RLS públicas para simplicidad. Para producción, considera:

- Agregar autenticación de usuarios
- Implementar políticas RLS basadas en usuarios
- Limitar el tamaño de archivos
- Agregar rate limiting
- Validar tipos de archivo en el servidor

## Licencia

MIT
>>>>>>> 7cff1ab (Initial commit)
