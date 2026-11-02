import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'restaurant.menu' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SITE_URL = 'https://taamclub.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=630&fit=crop&q=85';
const BRAND_NAME = 'TAAM Club';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  breadcrumbs,
  schema,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'tr';

  // Normalize canonical URL (no trailing slash except root)
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = cleanPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${cleanPath.replace(/\/+$/, '')}`;
  const trAlternate = canonicalUrl;
  const enAlternate = `${canonicalUrl}${canonicalUrl.includes('?') ? '&' : '?'}lang=en`;

  // Truncate to recommended character budgets
  const metaTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const metaDescription = description.length > 155 ? `${description.slice(0, 152)}...` : description;

  // Root WebSite & Restaurant entities with explicit Developer attribution
  const rootGraphEntities: Array<Record<string, unknown>> = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      'url': SITE_URL,
      'name': BRAND_NAME,
      'description': 'TAAM Club – İstanbul Gourmet Burgers, Crispy Chicken & Artisanal Experience',
      'inLanguage': ['tr-TR', 'en-US'],
      'publisher': {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@type': ['Restaurant', 'FastFoodRestaurant'],
      '@id': `${SITE_URL}/#organization`,
      'name': BRAND_NAME,
      'url': SITE_URL,
      'logo': `${SITE_URL}/taam-logo.svg`,
      'image': DEFAULT_IMAGE,
      'description': 'Premium smash burgerler, çıtır tavuk ve kanatlar, taş fırın pizza ve gurme tatlılar sunan modern restoran.',
      'email': 'info@taamclub.com',
      'hasMap': 'https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7',
      'priceRange': '₺₺',
      'servesCuisine': ['American', 'Burgers', 'Crispy Chicken', 'Fast Casual', 'Desserts'],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Güzide Mertcan',
        'addressLocality': 'Istanbul',
        'addressRegion': 'Istanbul',
        'addressCountry': 'TR',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 41.0082,
        'longitude': 28.9784,
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '11:00',
          'closes': '22:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Saturday', 'Sunday'],
          'opens': '10:00',
          'closes': '23:00',
        },
      ],
      'sameAs': [
        'https://www.instagram.com/taamclub/',
      ],
    },
  ];

  // Breadcrumbs schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    rootGraphEntities.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      'itemListElement': breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item}`,
      })),
    });
  }

  // Merge extra schemas into graph
  if (schema) {
    if (Array.isArray(schema)) {
      rootGraphEntities.push(...schema);
    } else {
      rootGraphEntities.push(schema);
    }
  }

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': rootGraphEntities,
  };

  return (
    <Helmet>
      {/* HTML Lang */}
      <html lang={currentLang} />

      {/* Basic Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical & Hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="tr" href={trAlternate} />
      <link rel="alternate" hrefLang="en" href={enAlternate} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:locale" content={currentLang === 'en' ? 'en_US' : 'tr_TR'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={metaTitle} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdGraph)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
