import { MetadataRoute } from 'next';
import { NICHE_CONFIG } from '@/lib/marketplace-templates';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://webkarigar.com';
  const lastModified = new Date();

  // Static Marketing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/demo`, lastModified, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/templates`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/changelog`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/roadmap`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Niche Interactive Demos (/demo/[niche])
  const niches = Object.keys(NICHE_CONFIG);
  const demoRoutes: MetadataRoute.Sitemap = niches.map((niche) => ({
    url: `${baseUrl}/demo/${niche}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Niche Template Gallery Pages (/templates/[niche])
  const templateRoutes: MetadataRoute.Sitemap = niches.map((niche) => ({
    url: `${baseUrl}/templates/${niche}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Features Pages (/features/[feature])
  const features = ['personalized-websites', 'email-campaigns', 'lead-generation'];
  const featureRoutes: MetadataRoute.Sitemap = features.map((feature) => ({
    url: `${baseUrl}/features/${feature}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Head-to-Head Comparison Pages (/vs/[competitor])
  const competitors = ['instantly', 'mailchimp', 'lemlist'];
  const vsRoutes: MetadataRoute.Sitemap = competitors.map((comp) => ({
    url: `${baseUrl}/vs/${comp}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Value Guides (/guides/[slug])
  const guides = ['how-to-get-web-design-clients', 'cold-email-personalized-websites'];
  const guideRoutes: MetadataRoute.Sitemap = guides.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Free Tools (/tools/[slug])
  const tools = ['cold-email-subject-generator', 'business-slug-generator', 'cta-generator'];
  const toolRoutes: MetadataRoute.Sitemap = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...demoRoutes,
    ...templateRoutes,
    ...featureRoutes,
    ...vsRoutes,
    ...guideRoutes,
    ...toolRoutes,
  ];
}
