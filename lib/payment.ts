// Pricing plans
export const PLANS = {
  intro: {
    id: 'intro_offer',
    name: 'Intro Offer — First Purchase',
    price: 100,         // ₹1 = 100 paise
    credits: 2000,
    durationDays: 30,
    currency: 'INR',
    label: '₹1',
  },
  pro: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 9900,        // ₹99 = 9900 paise
    credits: 2000,
    durationDays: 30,
    currency: 'INR',
    label: '₹99',
  },
};

// Legacy export for backward compat
export const PLAN = PLANS.pro;

export type PlanKey = keyof typeof PLANS;

