import Link from 'next/link';
import { ArrowLeft, Code, Globe, Link2, BookOpen, Zap, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Template Build Guide | WebKarigar',
  description: 'Learn how to build personalized website templates that work with the WebKarigar campaign system.',
};

export default function TemplateGuidePage() {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-10">
      {/* Back Link */}
      <div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white -ml-2" asChild>
          <Link href="/dashboard/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-blue-600/5 to-[#111827] border border-primary/10 rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">Build Guide</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">
            How to Build a WebKarigar Template
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            This guide explains how to create a landing page template that works seamlessly with the WebKarigar personalization system.
            Clients will see their name and business on a live website when you send a campaign.
          </p>
        </div>
      </div>

      {/* Flow Overview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          How the Flow Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
          {[
            { step: '1', title: 'Build Template', desc: 'Create a website that reads URL params', color: 'from-orange-500 to-red-500' },
            { step: '→', title: '', desc: '', color: '' },
            { step: '2', title: 'Import URL', desc: 'Add your template to marketplace', color: 'from-blue-500 to-indigo-500' },
            { step: '→', title: '', desc: '', color: '' },
            { step: '3', title: 'Insert in Email', desc: 'Paste personalized preview link', color: 'from-violet-500 to-purple-500' },
          ].map((item, i) =>
            item.step === '→' ? (
              <div key={i} className="hidden sm:flex justify-center text-gray-600">
                <ChevronRight className="h-6 w-6" />
              </div>
            ) : (
              <div key={i} className={`bg-gradient-to-br ${item.color} p-[1px] rounded-2xl`}>
                <div className="bg-[#0D1117] rounded-2xl p-4 text-center h-full">
                  <div className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-2`}>
                    {item.step}
                  </div>
                  <div className="font-semibold text-white text-sm">{item.title}</div>
                  <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">1</div>
          <h2 className="text-xl font-bold text-white">Required Template Structure</h2>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            Your template should be a standard HTML/CSS/JS website (or Next.js, React, Vue, etc.) deployed on any hosting platform
            (Vercel, Netlify, GitHub Pages, etc.). The <strong className="text-white">only requirement</strong> is that it reads
            personalization data from URL query parameters.
          </p>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Required URL Parameters</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { param: 'name', desc: "Lead's first name", example: '?name=John' },
                { param: 'business', desc: "Business or gym name", example: '?business=FitPro+Gym' },
                { param: 'slug', desc: 'Custom path identifier (optional)', example: '/gym/john-fitness' },
                { param: 'city', desc: 'City name for local relevance (optional)', example: '?city=Mumbai' },
              ].map(({ param, desc, example }) => (
                <div key={param} className="bg-[#0B0F19] border border-white/5 rounded-xl p-3">
                  <code className="text-primary font-mono text-sm">?{param}=</code>
                  <p className="text-gray-400 text-xs mt-1">{desc}</p>
                  <p className="text-gray-600 text-[11px] font-mono mt-1">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Code Examples */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">2</div>
          <h2 className="text-xl font-bold text-white">Code Examples</h2>
        </div>

        <div className="space-y-5">
          {/* Vanilla JS */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-white">Vanilla HTML / JavaScript</span>
            </div>
            <pre className="p-5 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`<script>
  // Read name from URL: ?name=John&business=GymPro
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'Valued Client';
  const business = params.get('business') || 'Your Business';

  // Inject into page
  document.getElementById('client-name').textContent = name;
  document.getElementById('business-name').textContent = business;
  
  // Update hero headline dynamically
  document.querySelector('.hero-title').innerHTML = 
    \`🔥 Transform <span class="highlight">\${business}</span> with Us!\`;
</script>

<!-- In your HTML -->
<h1 class="hero-title"></h1>
<p>Welcome, <span id="client-name"></span>!</p>`}
            </pre>
          </div>

          {/* Next.js */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Next.js (App Router)</span>
            </div>
            <pre className="p-5 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// app/page.tsx or app/[slug]/page.tsx
interface Props {
  searchParams: { name?: string; business?: string };
}

export default function LandingPage({ searchParams }: Props) {
  const name = searchParams.name || 'Valued Client';
  const business = searchParams.business || 'Your Business';

  return (
    <main>
      <h1>Transform {business} 🚀</h1>
      <p>Hey {name}, here's what we built for you...</p>
    </main>
  );
}`}
            </pre>
          </div>

          {/* React (client-side) */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">React (Client-Side)</span>
            </div>
            <pre className="p-5 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`import { useSearchParams } from 'next/navigation';
// OR for plain React:
// const params = new URLSearchParams(window.location.search);

export default function GymPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? 'Athlete';
  const business = searchParams.get('business') ?? 'Your Gym';

  return (
    <section className="hero">
      <h1>Welcome, {name}!</h1>
      <p>We built this preview specifically for {business}.</p>
      <button>Book a Free Demo →</button>
    </section>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Section 3: Preview URL Structure */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">3</div>
          <h2 className="text-xl font-bold text-white">Preview URL Structure</h2>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            When a lead receives your email and clicks the preview link, WebKarigar generates a URL like this:
          </p>
          <div className="bg-[#0B0F19] border border-primary/20 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Generated Preview URL</p>
            <code className="text-primary font-mono text-sm break-all">
              https://yourdomain.com/?name=John&business=GymPro+Fitness
            </code>
          </div>
          <div className="bg-[#0B0F19] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Slug-Based Alternative</p>
            <code className="text-primary font-mono text-sm break-all">
              https://yourdomain.com/gym/john-gympro-transformation
            </code>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Use <code className="text-gray-300">encodeURIComponent()</code> for special characters</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Always provide fallback defaults if params are missing</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Test with and without params before adding to campaign</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Deploy to Vercel/Netlify for free hosting</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Variables */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">4</div>
          <h2 className="text-xl font-bold text-white">Email Variables Reference</h2>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-bold">Variable</th>
                <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-bold">Replaced With</th>
                <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-bold">Use In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { variable: '{{name}}', desc: "Lead's first name", use: 'Email body, subject line' },
                { variable: '{{business_name}}', desc: 'Business/company name', use: 'Email body, subject line' },
                { variable: '{{preview_url}}', desc: 'Personalized template link', use: 'Email body as clickable link' },
                { variable: '{{email}}', desc: "Lead's email address", use: 'Email body reference' },
                { variable: '{{city}}', desc: "Lead's city (if available)", use: 'Subject line, body' },
              ].map(({ variable, desc, use }) => (
                <tr key={variable}>
                  <td className="px-5 py-3">
                    <code className="text-primary font-mono text-sm">{variable}</code>
                  </td>
                  <td className="px-5 py-3 text-gray-300">{desc}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Best Practices */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">5</div>
          <h2 className="text-xl font-bold text-white">Best Practices</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: '⚡',
              title: 'Fast Load Times',
              desc: 'Optimize images, use lazy loading. First meaningful paint under 2s for best conversion.',
            },
            {
              icon: '📱',
              title: 'Mobile First',
              desc: 'Most clients will view on phones. Test on 320px to 428px screen widths.',
            },
            {
              icon: '🎯',
              title: 'Single CTA',
              desc: 'One clear call-to-action. Book a call, WhatsApp, or a form. Don\'t confuse the visitor.',
            },
            {
              icon: '🔒',
              title: 'HTTPS Only',
              desc: 'Deploy to HTTPS. Email clients will block insecure preview links.',
            },
            {
              icon: '🎨',
              title: 'Niche-Specific Design',
              desc: 'Match colors and imagery to the industry. Gym = bold, Salon = soft, Real Estate = professional.',
            },
            {
              icon: '📊',
              title: 'Track Engagement',
              desc: 'Add UTM params or custom analytics to know when leads view the page.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#111827] border border-white/5 rounded-xl p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">Ready to add your template?</h3>
          <p className="text-gray-400 text-sm">Import it to the marketplace and start using it in campaigns instantly.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5" asChild>
            <Link href="/dashboard/templates">Browse Templates</Link>
          </Button>
          <Button className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 gap-2 shadow-lg" asChild>
            <Link href="/dashboard/templates">
              <Link2 className="h-4 w-4" />
              Import Template
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
