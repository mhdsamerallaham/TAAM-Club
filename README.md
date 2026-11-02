# TAAM Club — Official Restaurant & Culinary Platform

A bilingual (TR/EN), editorial brand, digital menu, careers, and CMS platform for **TAAM Club** (`@taamclub`, `https://taamclub.com`), engineered with React 19, TypeScript 6, Vite 8, Tailwind CSS v4, Framer Motion 13, and Supabase (PostgreSQL + Auth + RLS).

---

## 1. Project Overview

TAAM Club's web platform serves as the official digital flagship for its fast-casual culinary concept in Istanbul ("Good sofra, better days").

### Core Capabilities
- **Bilingual Digital Menu (`/menu`)**: Real-time category filtering, portion/weight indicators, multi-size price variants (`S/M/L`, `6/10/14 pcs`), dietary badges (`New`, `Signature`, `Spicy`, `Vegetarian`), and machine-readable specification tables.
- **Brand & Culinary Story (`/about`)**: Editorial storytelling, brand values, official Noord Design brand identity palette (`#002664` Pantone 281 C, `#E8291C`), and Anatolian kilim motifs (`TaamMotifs`).
- **Careers & Job Application Portal (`/careers`, `/kariyer`)**: Open hospitality/culinary positions and a client-side application form with mandatory KVKK Candidate Privacy Notice acknowledgment that formats structured applications to `info@taamclub.com`.
- **Contact & Location Hub (`/contact`)**: Google Maps embedded iframe, direct navigation links, operating hours, and official contact channels (`info@taamclub.com`, `@taamclub`).
- **Admin CMS (`/admin`)**: Authenticated management console for full CRUD operations on Products, Categories, Instagram Gallery items, and Site Settings, with an automatic in-memory Demo Mode fallback when Supabase environment variables are not configured.
- **Technical SEO & GEO (Generative Engine Optimization)**: Dynamic JSON-LD `@graph` (`WebSite`, `Restaurant`, `FastFoodRestaurant`, `Menu`, `FAQPage`, `ContactPage`, `AboutPage`, `BreadcrumbList`), `public/llms.txt`, and explicit AI crawler rules in `public/robots.txt`.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React + React DOM | `^19.2.8` | Component UI & rendering |
| **Language** | TypeScript | `~6.0.2` | Static type safety |
| **Build Tool** | Vite | `^8.3.0` | Bundler, HMR & code splitting |
| **Styling** | Tailwind CSS (`@tailwindcss/vite`) | `^4.3.3` | Design tokens & utility styling |
| **Animation** | Framer Motion | `^13.4.3` | Scroll parallax, page & reveal animations |
| **Routing** | React Router DOM | `^7.18.4` | Client-side SPA routing with `React.lazy` |
| **State Management** | Zustand | `^5.0.15` | Language state (`useLangStore`) |
| **Internationalization** | `i18next` + `react-i18next` | `^26.4.2` / `^17.0.15` | Bilingual TR/EN translations |
| **SEO & Head Management** | `react-helmet-async` | `^3.0.0` | Dynamic meta tags, canonicals, JSON-LD |
| **Backend / Database** | Supabase (`@supabase/supabase-js`) | `^2.117.1` | PostgreSQL database, Auth, RLS |
| **Icons** | `lucide-react` + Custom SVG | `^1.48.0` | UI icons, official TAAM vector wordmark & motifs |
| **Linter** | Oxlint | `^1.81.0` | High-speed Rust-based AST linter |
| **Hosting** | Vercel | Edge Network | SPA hosting & HTTP security headers |

---

## 3. Architecture

```text
taam-club/
├── public/
│   ├── favicon.svg                  # Official TAAM vector icon on #002664 background
│   ├── taam-logo.svg                # Official TAAM vector wordmark (extracted from brand PDF)
│   ├── llms.txt                     # Machine-readable knowledge graph for AI search engines
│   ├── robots.txt                   # Search & AI crawler access directives (/admin disallowed)
│   └── sitemap.xml                  # Bilingual XML sitemap with hreflang alternates
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Shared public wrapper (Navbar + <Outlet /> + Footer)
│   │   │   └── Footer.tsx           # Brand watermark, navigation, contact, TR/EN toggle
│   │   ├── navigation/
│   │   │   └── Navbar.tsx           # Sticky responsive header + mobile drawer
│   │   ├── seo/
│   │   │   └── SEOHead.tsx          # Dynamic meta tags, Open Graph, hreflang, JSON-LD @graph
│   │   └── ui/
│   │       ├── Icons.tsx            # Custom SVG social icons
│   │       └── Logo.tsx             # Official TaamLogo vector & 6 Anatolian TaamMotifs
│   ├── data/
│   │   └── demo.ts                  # Complete 8-category, 62-item menu fallback dataset
│   ├── hooks/
│   │   └── useLang.ts               # Zustand store syncing i18next & document.documentElement.lang
│   ├── i18n/
│   │   └── index.ts                 # Complete TR and EN translation dictionaries
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client initialization + Demo Mode detection
│   │       └── queries.ts           # Data access layer (Supabase + local fallback store)
│   ├── pages/
│   │   ├── HomePage.tsx             # Hero parallax, signature items, Instagram grid, FAQ
│   │   ├── MenuPage.tsx             # Sticky category tabs, itemized menu, variants, Menu JSON-LD
│   │   ├── AboutPage.tsx            # Brand story, stats, mission, values, specifications
│   │   ├── CareerPage.tsx           # Open roles, KVKK consent checkbox, mailto application form
│   │   ├── ContactPage.tsx          # Contact cards, Google Maps iframe, hours specification table
│   │   ├── AdminPage.tsx            # Supabase Auth login & CRUD managers (Products/Categories/IG/Settings)
│   │   └── NotFoundPage.tsx         # 404 page with noindex directive
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces (Category, Product, ProductVariant, etc.)
│   ├── App.tsx                      # Router configuration with React.lazy + Suspense code splitting
│   ├── main.tsx                     # React 19 root mount
│   └── index.css                    # Design system tokens (@theme), typography & utility classes
├── supabase/
│   └── migrations/
│       └── 001_init.sql             # PostgreSQL schema, indexes, triggers, RLS policies & seed data
├── docs/                            # Comprehensive Audit, KVKK, Security, SEO/GEO & Deployment docs
├── .env.example                     # Environment variable template
├── .oxlintrc.json                   # Linter rules configuration
├── vercel.json                      # Security headers, asset caching & SPA rewrite rules
└── vite.config.ts                   # Vite bundler & @ path alias configuration
```

### Data Flow & Fallback Mechanism
1. `src/lib/supabase/client.ts` inspects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. If valid credentials are provided (`isSupabaseConfigured === true`), `src/lib/supabase/queries.ts` executes live queries against Supabase PostgreSQL tables (`categories`, `products`, `instagram_posts`, `site_settings`).
3. If credentials are omitted or set to placeholders (`isSupabaseConfigured === false`), the app runs seamlessly in **Demo Mode**, serving the complete menu and brand data from `src/data/demo.ts`.

---

## 4. Installation & Local Development

### Prerequisites
- **Node.js**: v20.x LTS or newer (v22+ recommended)
- **npm**: v10.x or newer

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/mhdsamerallaham/TAAM-Club.git
cd taam-club

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start development server with HMR
npm run dev
```

The application will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Vite development server on port `5173` |
| `npm run build` | Runs TypeScript project references check (`tsc -b`) and builds production bundle (`dist/`) |
| `npm run lint` | Runs `oxlint` static analysis across all TypeScript/React files |
| `npm run preview` | Locally serves the production build from `dist/` |

---

## 5. Environment Variables

Create a `.env.local` file in the root directory (never commit `.env` or `.env.local` to Git):

| Variable | Required | Scope | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Required for Production CMS | Public (Client) | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Required for Production CMS | Public (Client) | Your Supabase public anonymous JWT key |

> **Security Warning:** All variables prefixed with `VITE_` are embedded into the client-side JavaScript bundle. **NEVER** place the Supabase `service_role` secret key or database passwords in any `VITE_*` variable or frontend file.

---

## 6. Database Setup (Supabase)

1. Create a new project in [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** and execute `supabase/migrations/001_init.sql`.
3. Verify the 4 tables are created with Row Level Security (RLS) enabled:
   - `public.categories`
   - `public.products` (includes `portion TEXT` and `variants JSONB`)
   - `public.instagram_posts`
   - `public.site_settings`
4. **Harden Admin Authentication**:
   - In Supabase Dashboard → **Authentication → Providers → Email**, **disable** "Allow new users to sign up" (Public Signups) so only manually invited administrators have `authenticated` role access, **AND** apply the role-based RLS policy documented in `docs/DATA_SECURITY_POLICY.md`.
5. In **Authentication → Users**, create your admin user account (`info@taamclub.com`).

---

## 7. API / Data Access Documentation

All database operations are encapsulated in `src/lib/supabase/queries.ts`:

| Function | Method / Table | Access Level | Description |
|---|---|---|---|
| `getCategories()` | `SELECT` `categories` (`is_active = true`) | Public (`anon`) | Fetches active menu categories ordered by `sort_order` |
| `getAllCategories()` | `SELECT` `categories` | Admin (`authenticated`) | Fetches all categories including inactive ones |
| `upsertCategory(cat)` | `UPSERT` `categories` | Admin (`authenticated`) | Creates or updates a category |
| `deleteCategory(id)` | `DELETE` `categories` | Admin (`authenticated`) | Deletes a category by UUID |
| `getProducts(slug?)` | `SELECT` `products` + `categories` | Public (`anon`) | Fetches active products, optionally filtered by category slug |
| `getFeaturedProducts()` | `SELECT` `products` (`is_featured = true`) | Public (`anon`) | Fetches up to 6 featured products for the homepage |
| `getAllProducts()` | `SELECT` `products` + `categories` | Admin (`authenticated`) | Fetches all products for CMS table |
| `upsertProduct(prod)` | `UPSERT` `products` | Admin (`authenticated`) | Creates or updates a product record |
| `deleteProduct(id)` | `DELETE` `products` | Admin (`authenticated`) | Deletes a product by UUID |
| `getInstagramPosts()` | `SELECT` `instagram_posts` (`is_active = true`) | Public (`anon`) | Fetches active Instagram gallery items |
| `getAllInstagramPosts()` | `SELECT` `instagram_posts` | Admin (`authenticated`) | Fetches all Instagram gallery items |
| `upsertInstagramPost(post)`| `UPSERT` `instagram_posts` | Admin (`authenticated`) | Creates or updates an Instagram post card |
| `deleteInstagramPost(id)` | `DELETE` `instagram_posts` | Admin (`authenticated`) | Deletes an Instagram post card |
| `getSiteSettings()` | `SELECT` `site_settings` | Public (`anon`) | Returns key-value map of site settings |
| `updateSiteSetting(k, v)` | `UPSERT` `site_settings` | Admin (`authenticated`) | Updates a site setting key-value pair |

---

## 8. Deployment Instructions (Vercel)

1. Push the repository to GitHub (`main` branch).
2. Import the repository into **Vercel**.
3. Configure **Framework Preset**: `Vite`, **Build Command**: `npm run build`, **Output Directory**: `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Project Settings → Environment Variables**.
5. Deploy and attach custom domain `taamclub.com` (and redirect `www.taamclub.com` → `taamclub.com`).
6. `vercel.json` automatically configures SPA routing rewrites, immutable asset caching (`/assets/*`), and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`).

---

## 9. Security & Legal Documentation Index

Detailed audit, compliance, and operational governance documents are maintained in the `/docs` directory:

- [`docs/FINAL_AUDIT.md`](./docs/FINAL_AUDIT.md) — Complete Architecture, Security, KVKK, SEO/GEO & Performance Audit Report
- [`docs/KVKK_AYDINLATMA_METNI.md`](./docs/KVKK_AYDINLATMA_METNI.md) — KVKK General & Job Applicant Privacy Notices (Aydınlatma Metni)
- [`docs/DATA_SECURITY_POLICY.md`](./docs/DATA_SECURITY_POLICY.md) — Technical & Administrative Data Security Policy + RLS Hardening SQL
- [`docs/DATA_BREACH_RESPONSE_PLAN.md`](./docs/DATA_BREACH_RESPONSE_PLAN.md) — 10-Step KVKK Incident & Data Breach Response Plan
- [`docs/COMMERCIAL_COMMUNICATION_CONSENT.md`](./docs/COMMERCIAL_COMMUNICATION_CONSENT.md) — Commercial Electronic Communication (ETK / İYS) Framework
- [`docs/PRE_INFORMATION_FORM.md`](./docs/PRE_INFORMATION_FORM.md) — Conditional Distance Sales Pre-Information Form Template
- [`docs/SEO_GEO_AUDIT.md`](./docs/SEO_GEO_AUDIT.md) — Technical SEO, Structured Data & Generative Engine Optimization Audit
- [`docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`](./docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md) — Pre-Launch & Post-Launch Verification Checklist
- [`docs/BUSINESS_INPUT_REQUIRED.md`](./docs/BUSINESS_INPUT_REQUIRED.md) — Consolidated Register of Pending Business & Legal Inputs

---

## 10. Maintenance Instructions

- **Updating Menu Items**: Log in at `/admin` when Supabase is connected, or update `src/data/demo.ts` if running in static mode. Keep `public/llms.txt` synchronized when signature prices change.
- **Dependency Updates**: Run `npm outdated` and `npm audit` monthly; verify builds with `npm run lint && npm run build`.
- **Database Backups**: Enable daily automated backups in Supabase Dashboard (Pro plan) or schedule weekly `pg_dump` exports of `categories`, `products`, `instagram_posts`, and `site_settings`.
