import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { SoftwareApplicationJsonLd, OrganizationJsonLd, WebSiteSearchJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL('https://webkarigar.com'),
  title: {
    default: 'WebKarigar | AI Website Personalization & Outreach SaaS',
    template: '%s | WebKarigar',
  },
  description:
    'Stop pitching. Start showing. WebKarigar helps freelancers, agencies, and web developers close clients by generating personalized websites for business leads before sending outreach.',
  keywords: [
    'WebKarigar',
    'Personalized Website Preview',
    'Website Outreach',
    'Cold Outreach Automation',
    'Lead Personalization',
    'AI Website Personalization',
    'Freelancer Client Acquisition',
    'Agency Sales Automation',
    'Email Campaigns',
    'Website Templates',
  ],
  authors: [{ name: 'WebKarigar Team', url: 'https://webkarigar.com' }],
  creator: 'WebKarigar',
  publisher: 'WebKarigar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WebKarigar | AI Website Personalization & Outreach SaaS',
    description:
      'Stop pitching. Start showing. Instantly generate personalized websites for local business leads to skyrocket cold email reply rates.',
    url: 'https://webkarigar.com',
    siteName: 'WebKarigar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebKarigar | AI Website Personalization & Outreach SaaS',
    description:
      'Stop pitching. Start showing. Generate personalized website previews for business leads before sending outreach.',
    creator: '@webkarigar',
  },
  verification: {
    other: {
      'msvalidate.01': '151A7039106A5922A3A46D954AC488E5',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#07090e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <SoftwareApplicationJsonLd />
        <OrganizationJsonLd />
        <WebSiteSearchJsonLd />
      </head>
      <body className="font-sans antialiased text-foreground bg-[#07090e] min-h-screen">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3NEHY001B8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3NEHY001B8');
          `}
        </Script>

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}