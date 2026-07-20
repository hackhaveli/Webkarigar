import { NextResponse } from 'next/server';

export async function GET() {
  const xmlContent = `<?xml version="1.0"?>
<users>
  <user>151A7039106A5922A3A46D954AC488E5</user>
</users>`;

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
