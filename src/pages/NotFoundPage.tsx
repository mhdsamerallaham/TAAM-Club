import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>404 – Sayfa Bulunamadı | TAAM Club</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-taam-blue flex flex-col items-center justify-center p-8 text-center">
        <div
          className="font-display text-white/10 leading-none mb-8 select-none"
          style={{ fontSize: 'clamp(120px, 30vw, 280px)' }}
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="font-display text-white text-4xl md:text-6xl leading-none mb-4">
          {t('notFound.title')}
        </h1>
        <p className="font-accent text-white/60 text-base mb-10 max-w-xs">
          {t('notFound.message')}
        </p>
        <Link
          to="/"
          className="btn-taam btn-taam-red text-sm px-8 py-4"
        >
          {t('notFound.back')}
        </Link>
      </div>
    </>
  );
}
