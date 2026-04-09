import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APPWRITE_ENDPOINT;
const supabaseAnonKey = import.meta.env.VITE_APPWRITE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
