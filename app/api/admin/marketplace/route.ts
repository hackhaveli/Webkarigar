import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const SUPREME_ADMIN = 'coderrohit2927@gmail.com';

// In-memory store for runtime overrides (persisted via lib/marketplace-overrides.ts)
// For a production app you'd store these in a database table
// We use a simple JSON file approach via the data store
import { getOverrides, saveOverride, deleteOverride, resetOverride } from '@/lib/marketplace-overrides';

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== SUPREME_ADMIN) {
    return null;
  }
  return session;
}

// GET — list all overrides
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const overrides = await getOverrides();
  return NextResponse.json({ overrides });
}

// POST — create/update override for a template
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { templateId, ...fields } = body;
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 });

    await saveOverride(templateId, fields);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE — remove override or hide template
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { templateId, action } = await req.json();
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 });

    if (action === 'reset') {
      await resetOverride(templateId);
    } else {
      await deleteOverride(templateId); // marks as hidden
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
