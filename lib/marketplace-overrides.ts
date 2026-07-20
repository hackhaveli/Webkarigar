/**
 * Marketplace Template Overrides
 * Allows the admin to override fields (isFeatured, hidden, previewUrl, name, etc.)
 * for marketplace templates at runtime without changing the static data file.
 * 
 * Stored in the database via a MarketplaceOverride model (or in-memory for now).
 * Falls back to in-memory map for deployments without DB migration.
 */

import { prisma } from './prisma';

export interface TemplateOverride {
  templateId: string;
  hidden?: boolean;
  isFeatured?: boolean;
  name?: string;
  description?: string;
  previewUrl?: string;
  demoClientName?: string;
  bestFor?: string;
  rating?: number;
  campaignUsage?: number;
  downloads?: number;
  updatedAt?: string;
  // Support for completely new admin-created global templates
  niche?: any;
  tags?: string[];
  isCustomGlobal?: boolean;
}

// We will use a generic 'MarketplaceOverride' table via raw SQL to avoid needing Prisma schema migrations
const memStore: Record<string, TemplateOverride> = {};

async function initTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MarketplaceOverride" (
        "templateId" TEXT PRIMARY KEY,
        "data" JSONB NOT NULL
      )
    `);
  } catch (e) {
    // silently fail, probably using mock/memStore
  }
}

export async function getOverrides(): Promise<Record<string, TemplateOverride>> {
  try {
    await initTable();
    const rows = await prisma.$queryRawUnsafe<{templateId: string, data: any}[]>('SELECT * FROM "MarketplaceOverride"');
    if (!rows) return memStore;
    
    const result: Record<string, TemplateOverride> = {};
    for (const row of rows) {
      result[row.templateId] = { templateId: row.templateId, ...row.data };
    }
    return result;
  } catch (err) {
    return memStore;
  }
}

export async function saveOverride(templateId: string, fields: Partial<TemplateOverride>): Promise<void> {
  try {
    await initTable();
    const current = await getOverrides();
    const existing = current[templateId] || {};
    const newData = { ...existing, ...fields };
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO "MarketplaceOverride" ("templateId", "data") 
      VALUES ($1, $2::jsonb)
      ON CONFLICT ("templateId") DO UPDATE SET "data" = EXCLUDED."data"
    `, templateId, JSON.stringify(newData));
  } catch (err) {
    memStore[templateId] = { ...memStore[templateId], templateId, ...fields };
  }
}

export async function deleteOverride(templateId: string): Promise<void> {
  await saveOverride(templateId, { hidden: true });
}

export async function resetOverride(templateId: string): Promise<void> {
  try {
    await initTable();
    await prisma.$executeRawUnsafe(`DELETE FROM "MarketplaceOverride" WHERE "templateId" = $1`, templateId);
  } catch {
    delete memStore[templateId];
  }
}

/**
 * Apply overrides to a list of marketplace templates
 * Also injects completely new custom templates created by the admin!
 */
export function applyOverrides<T extends { id: string }>(
  templates: T[],
  overrides: Record<string, TemplateOverride>
): (T & { _overridden?: boolean })[] {
  const existingIds = new Set(templates.map(t => t.id));

  // Modify base templates based on overrides
  const baseTemplates = templates
    .filter(t => !overrides[t.id]?.hidden)
    .map(t => {
      const ov = overrides[t.id];
      if (!ov) return t;
      return { ...t, ...ov, _overridden: true };
    });

  // Inject completely new templates that exist in overrides but not in static templates
  const newGlobalTemplates = Object.values(overrides)
    .filter(ov => !existingIds.has(ov.templateId) && !ov.hidden)
    .map(ov => ({ ...ov, id: ov.templateId, isCustomGlobal: true } as unknown as T));

  return [...baseTemplates, ...newGlobalTemplates];
}
