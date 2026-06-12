// ============================================================
//  CAREFLOW — Supabase Configuration
//  ⚠️  PASTE YOUR ANON KEY BELOW
//  Get it from: Supabase Dashboard → Project Settings → API
// ============================================================

const SUPABASE_URL  = "https://rdnsclbxihnnaattyyyo.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE"; // ← PASTE YOUR anon/public key here

// Initialize Supabase client (uses the global from CDN script)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
