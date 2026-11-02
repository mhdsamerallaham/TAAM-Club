import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://uhfnzpcesmqtyvkxkwcf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_fMltjF8FCx_zd5qX9f_PaA_DiH7KAZD';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('placeholder') &&
  !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured) {
  // Silent or informational demo mode
  console.info('TAAM Club running in Demo Mode (using local static data).');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);
