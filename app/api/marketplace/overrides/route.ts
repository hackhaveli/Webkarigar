import { NextResponse } from 'next/server';
import { getOverrides } from '@/lib/marketplace-overrides';

export const dynamic = 'force-dynamic';

export async function GET() {
  const overrides = await getOverrides();
  return NextResponse.json({ overrides });
}
