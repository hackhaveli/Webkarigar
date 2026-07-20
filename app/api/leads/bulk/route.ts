import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = await file.arrayBuffer();
  const fileType = file.name.split('.').pop()?.toLowerCase();

  let data: Record<string, string>[] = [];

  try {
    if (fileType === 'csv') {
      const text = new TextDecoder().decode(buffer);
      const parseResult = Papa.parse(text, { header: true, skipEmptyLines: true });
      data = parseResult.data as Record<string, string>[];
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    const cleanEmail = (raw: string | undefined | null) => {
      if (!raw || raw.includes('Waiting for processing')) return '';
      const emails = raw.split(',').map(e => e.trim()).filter(e => e && e.includes('@'));
      return emails[0] || '';
    };

    const leads = data
      .map((row) => {
        let rawEmail = row.Emails || row['Public email'] || row.Public_email || row.email || row.Email || row.EMAIL || '';
        const email = cleanEmail(rawEmail);
        
        const businessName = row.Name || row.Username || row.business_name || row.business || row.Business || row.company || '';
        
        let name = row['Full name'] || row.Full_name || row.name || '';
        if (!name || name.toLowerCase() === businessName.toLowerCase()) {
           name = businessName || 'Business Owner';
        }

        let niche = row.Category || row.niche || row.Niche || row.industry || '';

        return {
          userId: user.id,
          name,
          email,
          businessName,
          niche
        };
      })
      .filter((l) => l.email && l.name);

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found in file' }, { status: 400 });
    }

    const created = await prisma.lead.createMany({ data: leads });
    return NextResponse.json({ imported: created.count }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
