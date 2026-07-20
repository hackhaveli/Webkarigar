import { createClient } from '@supabase/supabase-js';

let client = null;

function getClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
      client = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return client;
}

/**
 * Browser-side Supabase client using anon key.
 * Lazy initialized via Proxy to support ESM environment variable loading order.
 */
export const supabase = new Proxy({}, {
  get(target, prop) {
    const activeClient = getClient();
    if (!activeClient) {
      return null;
    }
    const value = activeClient[prop];
    if (typeof value === 'function') {
      return value.bind(activeClient);
    }
    return value;
  }
});
