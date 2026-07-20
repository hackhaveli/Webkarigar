import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyAds } from '@/lib/lead-gen/gemini';

export async function POST() {
  try {
    const rawAds = await prisma.rawAd.findMany({
      select: { id: true, pageName: true, adText: true, ctaLink: true, niche: true },
    });

    const spamIds: string[] = [];
    (rawAds || []).forEach((ad) => {
      const pageName = (ad.pageName || '').toLowerCase();
      const adText = (ad.adText || '').toLowerCase();
      const ctaLink = (ad.ctaLink || '').toLowerCase();

      const isSpam =
        pageName.includes('dramabox') ||
        pageName.includes('drama') ||
        pageName.includes('novel') ||
        pageName.includes('story') ||
        pageName.includes('channel') ||
        pageName.startsWith('ns-') ||
        adText.includes('werewolf') ||
        adText.includes('mating bond') ||
        adText.includes('alpha mate') ||
        adText.includes('suger mommy') ||
        adText.includes('sugermommy') ||
        adText.includes('luna') ||
        adText.includes('chapters') ||
        ctaLink.includes('h5short.com') ||
        ctaLink.includes('netshort.com') ||
        ctaLink.includes('argbook.com') ||
        ctaLink.includes('moboreader.com') ||
        ctaLink.includes('goodnovel.com');

      if (isSpam) spamIds.push(ad.id);
    });

    let prunedCount = 0;
    if (spamIds.length > 0) {
      await prisma.rawAd.deleteMany({
        where: { id: { in: spamIds } },
      });
      prunedCount = spamIds.length;
    }

    await prisma.aILead.deleteMany({
      where: { status: 'pending' },
    });

    const remainingRawAds = await prisma.rawAd.findMany({
      select: { id: true, niche: true },
    });

    const nicheSet = new Set(remainingRawAds.map((ad) => ad.niche));
    const nichesToClassify = Array.from(nicheSet);
    let classifiedCount = 0;

    for (const niche of nichesToClassify) {
      const stats = await classifyAds(niche, 15);
      classifiedCount += stats.total;
    }

    return NextResponse.json({
      success: true,
      pruned: prunedCount,
      classified: classifiedCount,
    });
  } catch (err: any) {
    console.error('Reclassify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
