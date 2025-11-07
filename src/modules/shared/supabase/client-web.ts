// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error("supabaseUrl is required (set NEXT_PUBLIC_SUPABASE_URL)");
if (!anon) throw new Error("supabaseAnonKey is required (set NEXT_PUBLIC_SUPABASE_ANON_KEY)");

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
