import React from 'react';

export interface SoftwareAppSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
}

export function SoftwareApplicationJsonLd({
  name = 'WebKarigar',
  description = 'AI website personalization and outreach automation SaaS for freelancers, agencies, and web developers.',
  url = 'https://webkarigar.com',
  price = '0',
  priceCurrency = 'USD',
}: SoftwareAppSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    description,
    url,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WebKarigar',
    url: 'https://webkarigar.com',
    logo: 'https://webkarigar.com/webkarigar-white.png',
    sameAs: [
      'https://github.com/hackhaveli/Webkarigar',
      'https://twitter.com/webkarigar',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@webkarigar.com',
      contactType: 'customer support',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSearchJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WebKarigar',
    url: 'https://webkarigar.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webkarigar.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqPageJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface HowToStep {
  name: string;
  text: string;
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      itemListElement: [
        {
          '@type': 'HowToDirection',
          text: step.text,
        },
      ],
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
