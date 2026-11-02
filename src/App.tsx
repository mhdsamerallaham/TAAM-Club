import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';

// Lazy-loaded routes for optimal bundle splitting
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CareerPage = lazy(() => import('@/pages/CareerPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Initialize i18n
import '@/i18n';

function PageFallback() {
  return (
    <div className="min-h-screen bg-taam-off-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-taam-blue border-t-transparent rounded-full animate-spin" aria-label="Yükleniyor" />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public routes wrapped in Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareerPage />} />
              <Route path="/kariyer" element={<CareerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin – standalone (own layout) */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
