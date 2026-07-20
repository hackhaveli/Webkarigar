import { NextResponse } from 'next/server';
import { getNiches, setNiche, deleteNiche } from '@/lib/lead-gen/niches';

export async function GET() {
  try {
    const nichesMap = getNiches();
    const nichesArray = Object.entries(nichesMap).map(([value, data]: [string, any]) => ({
      value,
      ...data,
    }));
    return NextResponse.json({ success: true, niches: nichesArray });
  } catch (err: any) {
    console.error('Niches GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value, label, searchKeywords, templateBases, templateDomain, messageTemplate } = body;

    if (!value) {
      return NextResponse.json({ error: 'Niche value (ID) is required' }, { status: 400 });
    }

    const niche = setNiche(value, {
      label,
      searchKeywords,
      templateBases,
      templateDomain,
      messageTemplate,
    });

    return NextResponse.json({ success: true, niche });
  } catch (err: any) {
    console.error('Niches POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { value } = body;

    if (!value) {
      return NextResponse.json({ error: 'Niche value is required' }, { status: 400 });
    }

    const success = deleteNiche(value);
    if (!success) {
      return NextResponse.json({ error: 'Niche not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Niches DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
