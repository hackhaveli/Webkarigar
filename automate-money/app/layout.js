import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'LeadFlow — Multi-Niche Lead Automation',
  description: 'Scrape Meta Ads, AI-classify leads, generate personalized demos & WhatsApp messages — all from one dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />

          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
