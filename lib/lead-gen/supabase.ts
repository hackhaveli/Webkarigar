import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    const supabaseUrl =
      process.env.LEADGEN_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL;
    const supabaseServiceKey =
      process.env.LEADGEN_SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY;

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
    if (!activeClient) {
      if (prop === 'from') {
        return (_tableName: string) => ({
          select: () =>
            Promise.resolve({
              data: [],
              error: {
                message:
                  'Supabase credentials not configured. Please set LEADGEN_SUPABASE_URL and LEADGEN_SUPABASE_SERVICE_KEY in your environment or Admin Settings.',
              },
            }),
          insert: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Supabase credentials not configured.' },
            }),
          update: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Supabase credentials not configured.' },
            }),
          delete: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Supabase credentials not configured.' },
            }),
          upsert: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Supabase credentials not configured.' },
            }),
        });
      }
      return undefined as any;
    }
    const value = (activeClient as any)[prop];
    if (typeof value === 'function') {
      return value.bind(activeClient);
    }
    return value;
  },
}) as ReturnType<typeof createClient>;
