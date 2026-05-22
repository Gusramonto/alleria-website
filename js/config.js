// =============================================
// ALLERIA — Supabase Configuration
// =============================================
// Reemplaza estos valores con los de tu proyecto Supabase.
// Los encontrarás en: Supabase Dashboard → Settings → API
//
// SUPABASE_URL  → "Project URL"
// SUPABASE_KEY  → "anon public" key (es segura para el frontend)
// =============================================

const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI';
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';

// Indica si Supabase está configurado (se usa para degradación elegante)
const SUPABASE_CONFIGURED = (
  SUPABASE_URL !== 'TU_SUPABASE_URL_AQUI' &&
  SUPABASE_KEY !== 'TU_SUPABASE_ANON_KEY_AQUI'
);
