import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://webkarigar.vercel.app';

  const feedItems = [
    {
      title: 'How to Get Web Design Clients Using Personalized Website Previews',
      link: `${baseUrl}/guides/how-to-get-web-design-clients`,
      description: 'Learn how freelancers and digital agencies double cold email reply rates by attaching personalized live site previews before pitching.',
      pubDate: new Date('2026-07-01').toUTCString(),
    },
    {
      title: 'Why Personalized Website Cold Outreach Beats Generic Pitch Emails',
      link: `${baseUrl}/guides/cold-email-personalized-websites`,
      description: 'A deep dive into outreach psychology: how showing tangible value upfront converts cold business prospects into high-ticket clients.',
      pubDate: new Date('2026-07-10').toUTCString(),
    },
    {
      title: 'WebKarigar Platform Release & Roadmap Overview',
      link: `${baseUrl}/changelog`,
      description: 'Explore the latest updates to WebKarigar including Multi-SMTP rotation, AI lead scoring, and instant niche template generation.',
      pubDate: new Date('2026-07-15').toUTCString(),
    },
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WebKarigar Insights & Updates</title>
    <link>${baseUrl}</link>
    <description>Product updates, outreach strategies, and client acquisition guides for freelancers and agencies.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
