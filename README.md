# WebKarigar 🚀

WebKarigar is a professional, high-performance SaaS platform built for freelancers, agencies, and developers to automate lead acquisition, personalized website generation, and client outreach. 

Instead of traditional cold pitches, WebKarigar empowers you to **show value first** by instantly scraping lead data, generating tailored website previews for businesses, and sending them directly via SMTP-rotated email templates.

---

## 🌟 Key Features

- **Smart Scraper**: Automatic data extraction that parses business details, contact information, and branding elements.
- **Instant AI Website Generator**: Generates customized website variations (Modern, Elegant, Minimalist) for targeted leads in seconds.
- **Built-in Email Outreach**: Outbound campaigns with automated SMTP rotation, custom templates, and direct link injection to preview generated websites.
- **Local & FTP Deployment**: One-click extraction, RAR installation, or direct FTP deployment to live servers.
- **Premium UI/UX**: Designed using advanced glassmorphism, fluid micro-interactions, responsive grids, and deep OLED-optimized dark modes.

---

## 🗺️ Future Roadmap & Upcoming Features

To maximize conversion rates and expand lead sources, WebKarigar is expanding into multi-channel campaigns:

1. **Meta Ads & Social Lead Finder (Next Up)**:
   - Direct integration with Meta Graph API to extract fresh leads from Facebook Ads Library, Instagram Profiles, and Facebook Pages.
   - Lead enrichment using social signals, ad spend estimation, and pixel tracking status.
2. **Google Maps Scraper Enrichment**:
   - Deeper data extraction including reviews sentiment analysis, unclaimed business profile status, and website speed metrics.
3. **LinkedIn Outreach & Automation**:
   - B2B lead generation via LinkedIn Sales Navigator and automated connection requests/messages with preview landing pages.
4. **Custom AI Agent Co-Writer**:
   - Automated personalization of outreach emails based on the scraped business's weaknesses (e.g. "Your current site takes 4.5 seconds to load, here is a fast version we made for you").

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org/)
- **Database**: [Prisma ORM](https://www.prisma.io/) & PostgreSQL / SQLite
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS with custom glassmorphism utilities
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: NextAuth.js
- **SMTP**: Multi-SMTP configuration & NodeMailer

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hackhaveli/Webkarigar.git
   cd Webkarigar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db" # Or your PostgreSQL URI
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database & Seed**:
   ```bash
   npx prisma db push
   # Optional: run seeding scripts if available
   node seed-admin.js
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📂 Project Architecture

```
Webkarigar/
├── app/                  # Next.js App Router (marketing, dashboard, auth)
├── components/           # Reusable UI & section components
│   ├── sections/         # Landing page sections (hero, features, FAQ, etc.)
│   └── ui/               # Radix-ui based custom primitives
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & helpers
├── prisma/               # Database schema & migrations
└── public/               # Static assets & generated template folders
```

---

## 📄 License

This project is proprietary. All rights reserved.