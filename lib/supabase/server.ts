import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Crear cliente de Supabase para el servidor
 * IMPORTANTE: No guardar en variable global, crear nuevo cliente en cada función
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignorar si se llama desde Server Component
        }
      },
    },
  })
}
