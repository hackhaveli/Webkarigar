export type Niche = 'gym' | 'salon' | 'real-estate' | 'coaching' | 'restaurant' | 'ecommerce';

export interface MarketplaceTemplate {
  id: string;
  name: string;
  niche: Niche;
  description: string;
  previewUrl: string;
  githubUrl: string;
  previewImage: string;
  features: string[];
  tags: string[];
  rating: number;
  downloads: number;
  isFeatured?: boolean;
  // Conversion-focused fields
  bestFor: string;
  conversionTag: { emoji: string; label: string; color: string };
  campaignUsage: number;
  trustBadges: string[];
  demoClientName: string; // Name shown in "Viewing as:" banner
}

export const NICHE_CONFIG: Record<Niche, { label: string; color: string; bg: string; gradient: string }> = {
  gym: {
    label: 'Gym & Fitness',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    gradient: 'from-orange-500 to-red-600',
  },
  salon: {
    label: 'Salon & Beauty',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    gradient: 'from-pink-500 to-rose-600',
  },
  'real-estate': {
    label: 'Real Estate',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    gradient: 'from-blue-500 to-indigo-600',
  },
  coaching: {
    label: 'Coaching',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    gradient: 'from-violet-500 to-purple-600',
  },
  restaurant: {
    label: 'Restaurant',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    gradient: 'from-yellow-500 to-amber-600',
  },
  ecommerce: {
    label: 'E-Commerce',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    gradient: 'from-teal-500 to-cyan-600',
  },
};

export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'gym-modern',
    name: 'Gym Modern',
    niche: 'gym',
    description: 'High-energy fitness landing page with transformation story, trainer profiles, and membership pricing.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/gym-modern-template',
    previewImage: '',
    features: ['Slug-based personalization', 'Trainer profiles', 'Pricing table', 'Before/After gallery', 'WhatsApp CTA'],
    tags: ['fitness', 'gym', 'transformation', 'membership'],
    rating: 4.8,
    downloads: 342,
    isFeatured: true,
    bestFor: 'Gym owners with Instagram & walk-in leads',
    conversionTag: { emoji: '🔥', label: 'High Reply Potential', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    campaignUsage: 120,
    trustBadges: ['Optimized for outreach', 'Lightweight & fast loading'],
    demoClientName: 'SPT Transformation Studio',
  },
  {
    id: 'gym-dark-power',
    name: 'Gym Dark Power',
    niche: 'gym',
    description: 'Bold dark-themed gym page with class schedules, athlete testimonials, and a dynamic hero.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/gym-dark-template',
    previewImage: '',
    features: ['Class schedule', 'Video background', 'Testimonials', 'Contact form', 'Mobile first'],
    tags: ['fitness', 'dark', 'premium', 'powerlifting'],
    rating: 4.6,
    downloads: 218,
    bestFor: 'Premium gyms targeting serious athletes',
    conversionTag: { emoji: '💪', label: 'Premium Feel', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    campaignUsage: 85,
    trustBadges: ['Tested for high response', 'Mobile first design'],
    demoClientName: 'Iron Peak Performance',
  },
  {
    id: 'salon-luxe',
    name: 'Salon Luxe',
    niche: 'salon',
    description: 'Elegant beauty salon page with service menu, stylist portfolio, and booking integration.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/salon-luxe-template',
    previewImage: '',
    features: ['Stylist portfolio', 'Services menu', 'Online booking', 'Gallery', 'Personalized greeting'],
    tags: ['salon', 'beauty', 'spa', 'luxury'],
    rating: 4.9,
    downloads: 189,
    isFeatured: true,
    bestFor: 'Luxury salons targeting high-value clients',
    conversionTag: { emoji: '✨', label: 'Top Converter', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    campaignUsage: 94,
    trustBadges: ['Optimized for outreach', 'High booking rate'],
    demoClientName: 'Glamour & Grace Beauty Studio',
  },
  {
    id: 'salon-modern-glow',
    name: 'Salon Modern Glow',
    niche: 'salon',
    description: 'Contemporary beauty studio with soft gradients, before/after transformations, and client reviews.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/salon-glow-template',
    previewImage: '',
    features: ['Before/After slider', 'Instagram feed', 'Price list', 'Team profiles'],
    tags: ['salon', 'glow', 'modern', 'beauty'],
    rating: 4.5,
    downloads: 134,
    bestFor: 'Salons with strong Instagram presence',
    conversionTag: { emoji: '💅', label: 'Social-Ready', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    campaignUsage: 61,
    trustBadges: ['Instagram-optimized', 'Lightweight & fast loading'],
    demoClientName: 'Radiant Glow Salon',
  },
  {
    id: 'realestate-premium',
    name: 'Real Estate Premium',
    niche: 'real-estate',
    description: 'Professional property showcase with neighborhood map, listings carousel, and mortgage calculator.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/realestate-premium-template',
    previewImage: '',
    features: ['Property listings', 'Virtual tour', 'Map integration', 'Mortgage calculator', 'Agent profile'],
    tags: ['property', 'real-estate', 'listings', 'agent'],
    rating: 4.7,
    downloads: 276,
    isFeatured: true,
    bestFor: 'Agents running cold outreach to buyers & sellers',
    conversionTag: { emoji: '🏆', label: 'Proven Results', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    campaignUsage: 140,
    trustBadges: ['Tested for high response', 'Optimized for outreach'],
    demoClientName: 'Prestige Properties Mumbai',
  },
  {
    id: 'realestate-minimal',
    name: 'Real Estate Minimal',
    niche: 'real-estate',
    description: 'Clean minimal property page focused on a single development with stunning photography.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/realestate-minimal-template',
    previewImage: '',
    features: ['Single property focus', 'Photo gallery', 'Floor plan', 'Contact form', 'Neighborhood stats'],
    tags: ['property', 'minimal', 'luxury', 'showcase'],
    rating: 4.4,
    downloads: 98,
    bestFor: 'Developers launching a single luxury project',
    conversionTag: { emoji: '🏠', label: 'Luxury Listings', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    campaignUsage: 42,
    trustBadges: ['Lightweight & fast loading', 'Mobile first design'],
    demoClientName: 'CloudView Residences',
  },
  {
    id: 'coaching-transform',
    name: 'Coaching Transform',
    niche: 'coaching',
    description: 'Authority-building coaching page with success stories, program outline, and discovery call booking.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/coaching-transform-template',
    previewImage: '',
    features: ['Success stories', 'Program modules', 'Discovery call CTA', 'Coach bio', 'FAQ accordion'],
    tags: ['coaching', 'business', 'transformation', 'consulting'],
    rating: 4.8,
    downloads: 312,
    isFeatured: true,
    bestFor: 'Business coaches targeting corporate clients',
    conversionTag: { emoji: '🎯', label: 'High Reply Potential', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    campaignUsage: 158,
    trustBadges: ['Tested for high response', 'Optimized for outreach'],
    demoClientName: 'Apex Business Coaching',
  },
  {
    id: 'coaching-mindset',
    name: 'Coaching Mindset',
    niche: 'coaching',
    description: 'Life and mindset coaching page with podcast section, free resources, and community sign-up.',
    previewUrl: 'https://webhypegym-1.vercel.app/',
    githubUrl: 'https://github.com/webkarigar/coaching-mindset-template',
    previewImage: '',
    features: ['Podcast player', 'Free resources', 'Community CTA', 'Testimonials', 'Newsletter'],
    tags: ['coaching', 'mindset', 'life-coach', 'wellness'],
    rating: 4.3,
    downloads: 156,
    bestFor: 'Life coaches building online communities',
    conversionTag: { emoji: '🧠', label: 'Community Builder', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    campaignUsage: 73,
    trustBadges: ['High engagement rate', 'Lightweight & fast loading'],
    demoClientName: 'Mindshift Coaching Academy',
  },
];

export function getTemplateById(id: string): MarketplaceTemplate | undefined {
  return MARKETPLACE_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByNiche(niche: Niche | 'all'): MarketplaceTemplate[] {
  if (niche === 'all') return MARKETPLACE_TEMPLATES;
  return MARKETPLACE_TEMPLATES.filter(t => t.niche === niche);
}

export function searchTemplates(query: string): MarketplaceTemplate[] {
  const q = query.toLowerCase();
  return MARKETPLACE_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q)) ||
    t.niche.includes(q)
  );
}
