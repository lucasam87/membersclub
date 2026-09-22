import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Client com service role: contorna RLS. Uso restrito a rotas de servidor
// que ja' validaram a identidade do usuario por outro meio (ex.: correcao
// de quiz, que precisa ler quiz_alternativas.correta). Nunca importar em
// codigo que roda no browser.
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
