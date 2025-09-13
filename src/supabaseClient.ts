import { createClient } from '@supabase/supabase-js'

// Pega as chaves do seu arquivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cria e EXPORTA o cliente Supabase. A palavra "export" aqui é a chave.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)