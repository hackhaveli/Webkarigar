import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WebKarigar - AI Website Personalization SaaS',
    short_name: 'WebKarigar',
    description:
      'Generate personalized website previews for business leads to skyrocket cold outreach reply rates.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090e',
    theme_color: '#07090e',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
