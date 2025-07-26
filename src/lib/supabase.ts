// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Ambil variabel lingkungan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Pengecekan sederhana untuk memastikan variabel lingkungan tidak kosong
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

// Pastikan ada 'export' di sini:
// Gunakan operator non-null assertion (!) karena kita sudah melakukan pengecekan di atas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);