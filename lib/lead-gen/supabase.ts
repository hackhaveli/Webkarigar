import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    const supabaseUrl = process.env.LEADGEN_SUPABASE_URL;
    const supabaseServiceKey = process.env.LEADGEN_SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith('http')) {
      client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }
  return client;
}

export const supabase = new Proxy({}, {
  get(_target, prop: string | symbol) {
    const activeClient = getClient();
    if (!activeClient) return undefined as any;
    const value = (activeClient as any)[prop];
    if (typeof value === 'function') {
      return value.bind(activeClient);
    }
    return value;
  }
}) as ReturnType<typeof createClient>;
