# TAAM Club — Premium Restaurant Website

A premium, editorial restaurant website for **TAAM Club** (@taamclub) built with React, TypeScript, Vite, Tailwind CSS, Framer Motion and Supabase.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 13 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| i18n | react-i18next |
| Routing | React Router DOM v7 |
| State | Zustand |
| Icons | Lucide React |
| SEO | React Helmet Async |
| Hosting | Vercel |

---

## Project Structure

```
taam-club/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── llms.txt              # GEO/AEO AI crawler file
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   └── Footer.tsx
│   │   └── navigation/
│   │       └── Navbar.tsx
│   ├── data/
│   │   └── demo.ts           # Fallback data (no Supabase needed for dev)
│   ├── hooks/
│   │   └── useLang.ts        # Language store (Zustand)
│   ├── i18n/
│   │   └── index.ts          # TR/EN translations
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts     # Supabase client
│   │       └── queries.ts    # All data access functions
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # Design system + Tailwind
├── supabase/
│   └── migrations/
│       └── 001_init.sql      # Full DB migration
├── .env.example
├── vercel.json
└── vite.config.ts
```

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/your-org/taam-club.git
cd taam-club
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The website works without Supabase — it uses demo data as fallback. You only need Supabase for the admin panel and live menu data.

### 3. Run dev server

```bash
npm run dev
```

Visit: http://localhost:5173

### 4. Build

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## Supabase Setup

### 1. Create a Supabase project

Go to https://supabase.com and create a new project.

### 2. Run migrations

In the Supabase SQL Editor, paste and run the contents of:

```
supabase/migrations/001_init.sql
```

This creates:
- `categories` table
- `products` table
- `instagram_posts` table
- `site_settings` table
- All Row Level Security (RLS) policies
- Demo seed data

### 3. Create admin user

In Supabase Authentication > Users, create a new user with email/password. This user will have full admin access.

### 4. Get API keys

In Supabase > Settings > API:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

> ⚠️ **NEVER** use the `service_role` key in the frontend. Only use the `anon` key.

---

## Admin Panel

URL: `/admin`

Authentication: Supabase Auth (email + password)

Features:
- **Products** — Full CRUD for menu items
- **Categories** — Manage menu categories
- **Instagram** — Add/manage Instagram gallery posts
- **Settings** — Address, phone, hours, email, maps URL

---

## Database Schema

### categories
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name_tr | TEXT | Turkish name |
| name_en | TEXT | English name |
| slug | TEXT | URL slug (unique) |
| sort_order | INT | Display order |
| is_active | BOOLEAN | Public visibility |

### products
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| category_id | UUID | FK to categories |
| name_tr / name_en | TEXT | Bilingual name |
| description_tr / description_en | TEXT | Bilingual description |
| price | DECIMAL | Price in TRY |
| image_url | TEXT | Image URL |
| is_featured | BOOLEAN | Show on homepage |
| is_new / is_signature / is_spicy / is_vegetarian | BOOLEAN | Product tags |

### instagram_posts
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| image_url | TEXT | Image URL |
| instagram_url | TEXT | Link to post |
| caption_tr / caption_en | TEXT | Bilingual caption |
| sort_order | INT | Display order |

### site_settings
Key-value store for configurable site content.

---

## Bilingual System (TR / EN)

- **Default language:** Turkish
- **Language toggle:** TR | EN in navbar and footer
- **Static text:** `src/i18n/index.ts`
- **Dynamic content:** DB fields `name_tr/en`, `description_tr/en`
- **Language state:** Zustand store in `src/hooks/useLang.ts`

---

## SEO Implementation

Every page has:
- Unique `<title>` and `<meta description>`
- Open Graph tags
- Canonical URLs
- JSON-LD structured data (Restaurant, LocalBusiness)
- Semantic HTML (h1 hierarchy, ARIA labels)

SEO files:
- `public/robots.txt` — with admin protection + AI crawler rules
- `public/sitemap.xml` — with hreflang alternates
- `public/llms.txt` — machine-readable business description for AI search

---

## GEO / AEO (AI Search Optimization)

Prepared for:
- Google AI Overviews
- ChatGPT Search
- Perplexity
- Claude, Gemini

Implementation:
- `llms.txt` with entity description
- JSON-LD Restaurant schema on home + contact pages
- Clear semantic HTML with entity information
- AI crawler permissions in `robots.txt`

---

## Vercel Deployment

### 1. Connect repository

Push to GitHub, then connect to Vercel.

### 2. Configure environment variables

In Vercel Project > Settings > Environment Variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

### 3. Deploy

Vercel auto-deploys on push to main. SPA routing is handled by `vercel.json`.

### 4. Custom domain

In Vercel > Domains, add your custom domain (e.g., `taamclub.com`).

---

## Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Add your Vercel domain as property
3. Verify via HTML meta tag or DNS
4. Submit sitemap: `https://taamclub.com/sitemap.xml`
5. Monitor:
   - Coverage
   - Core Web Vitals
   - Mobile Usability

---

## Instagram Integration

**Current:** Supabase-managed gallery (admin adds posts manually)

**Future:** Official Meta/Instagram Basic Display API

Architecture for future API integration:
1. Create a Meta App with `instagram_basic` permission
2. Get access token via OAuth
3. Replace `getInstagramPosts()` in `src/lib/supabase/queries.ts` with Meta API call
4. Fall back to Supabase gallery if API fails

---

## Analytics Architecture

The codebase is prepared for analytics without activating tracking:

Analytics events to implement:
- `menu_view` — Menu page loaded
- `menu_category_click` — Category filter clicked
- `product_view` — Product card hovered/tapped
- `instagram_click` — Instagram gallery clicked
- `google_maps_click` — Maps link clicked
- `phone_click` — Phone link clicked
- `language_change` — TR/EN toggle

Add to `src/lib/analytics/index.ts` when ready:
- Google Analytics 4
- Meta Pixel
- Google Tag Manager

---

## Performance Notes

- Lazy loading on all images
- Framer Motion respects `prefers-reduced-motion`
- Tailwind CSS v4 with minimal bundle
- No unused dependencies
- Code splitting via React Router lazy() (future optimization)

---

## Future Improvements

- [ ] Official Instagram API integration
- [ ] Image uploads via Supabase Storage
- [ ] React.lazy() code splitting per page
- [ ] Dynamic sitemap generation
- [ ] PWA manifest
- [ ] Google Analytics 4
- [ ] Meta Pixel
- [ ] URL-based language routing (/tr/, /en/)
- [ ] Menu search/filter
- [ ] Product detail modal
- [ ] Online order link

---

## License

Private. All rights reserved. TAAM Club © 2024.
