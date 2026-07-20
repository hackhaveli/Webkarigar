import { prisma } from './prisma';

export interface ISettings {
  defaultCredits: number;
  creditsPerEmail: number;
  freePlanLimit: number;
}

const DEFAULT_SETTINGS: ISettings = {
  defaultCredits: 10,
  creditsPerEmail: 1,
  freePlanLimit: 10,
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

    const result = await prisma.$queryRawUnsafe<{key: string, value: string}[]>('SELECT * FROM "SystemSetting"');
    if (!result || result.length === 0) return DEFAULT_SETTINGS;
    
    const settings = { ...DEFAULT_SETTINGS };
    for (const row of result) {
      if (row.key in settings) {
        (settings as any)[row.key] = parseInt(row.value, 10);
      }
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
      if (val !== undefined) {
         // Upsert using raw SQL
         await prisma.$executeRawUnsafe(`
           INSERT INTO "SystemSetting" ("key", "value") 
           VALUES ('${key}', '${val}')
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
