import { prisma } from './prisma';

export interface ISettings {
  defaultCredits: number;
  creditsPerEmail: number;
  freePlanLimit: number;
  metaAdsApiKey: string;
  metaAdsPixelId: string;
  metaAdsAccountId: string;
  leadgenSupabaseUrl: string;
  leadgenSupabaseServiceKey: string;
}

const DEFAULT_SETTINGS: ISettings = {
  defaultCredits: 10,
  creditsPerEmail: 1,
  freePlanLimit: 10,
  metaAdsApiKey:
    'EAAOq9OGZCu9EBSEbYITNZC7Yw8yBJhVMutPXWGwTJHbg9rXdieVBN8WWJXpZBUQqt3ZBAIGO3mO2P3N2IORHDc5r1cIdk0RenlWBjmZCKKMNxah9Bjx3CWwXH22KCdFsZCmzMo3MgR5vQDC228rZAdYqv5f98u8uPxzCkr9BLy5rc1f39y3Q7lYVgjtRNFZAR7SzTjMvivzuMxOaovgDuEKVXcA6wQZB5iKHdZCyTgihdFNfqfhKKb8jt9qOGkXbHnAORwJB0oQjdL194DDYsBtm0vlcyw10UZAWZCRK2gZDZD',
  metaAdsPixelId: '',
  metaAdsAccountId: '',
  leadgenSupabaseUrl: '',
  leadgenSupabaseServiceKey: '',
};

export async function getSystemSettings(): Promise<ISettings> {
  try {
    // Dynamically create table if it doesn't exist (works in Postgres)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL
      )
    `);

    const result = await prisma.$queryRawUnsafe<{ key: string; value: string }[]>('SELECT * FROM "SystemSetting"');
    if (!result || result.length === 0) return DEFAULT_SETTINGS;

    const settings = { ...DEFAULT_SETTINGS };
    for (const row of result) {
      if (row.key in settings) {
        if (['defaultCredits', 'creditsPerEmail', 'freePlanLimit'].includes(row.key)) {
          (settings as any)[row.key] = parseInt(row.value, 10) || 0;
        } else {
          (settings as any)[row.key] = row.value || '';
        }
      }
    }

    if (!settings.metaAdsApiKey) {
      settings.metaAdsApiKey = DEFAULT_SETTINGS.metaAdsApiKey;
    }

    return settings;
  } catch (err) {
    console.error('getSystemSettings error:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSystemSettings(newSettings: Partial<ISettings>) {
  try {
    for (const [key, val] of Object.entries(newSettings)) {
      if (val !== undefined && val !== null) {
        const safeVal = String(val).replace(/'/g, "''");
        // Upsert using raw SQL
        await prisma.$executeRawUnsafe(`
          INSERT INTO "SystemSetting" ("key", "value") 
          VALUES ('${key}', '${safeVal}')
          ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"
        `);
      }
    }
    return true;
  } catch (err) {
    console.error('updateSystemSettings error:', err);
    return false;
  }
}
