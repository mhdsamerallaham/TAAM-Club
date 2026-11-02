import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { Send, CheckCircle2, Clock, MapPin, Sparkles, Users, UtensilsCrossed } from 'lucide-react';
import { TaamMotifs } from '@/components/ui/Logo';

interface JobPosition {
  id: string;
  title_tr: string;
  title_en: string;
  dept_tr: string;
  dept_en: string;
  type_tr: string;
  type_en: string;
  location_tr: string;
  location_en: string;
  description_tr: string;
  description_en: string;
}

const OPEN_POSITIONS: JobPosition[] = [
  {
    id: 'pos-1',
    title_tr: 'Mutfak Ekip Üyesi & Smash Burger Ustası',
    title_en: 'Kitchen Team Member & Smash Specialist',
    dept_tr: 'Mutfak & Operasyon',
    dept_en: 'Kitchen & Operations',
    type_tr: 'Tam Zamanlı',
    type_en: 'Full Time',
    location_tr: 'İstanbul',
    location_en: 'Istanbul',
    description_tr: 'Smash burger ve sıcak istasyonlarında reçetelere uygun, hijyenik ve yüksek standartlarda üretim yapacak takım arkadaşı.',
    description_en: 'Passionate cook to prepare signature smash burgers and hot station orders according to standardized recipes.',
  },
  {
    id: 'pos-2',
    title_tr: 'Taş Fırın Pizza Ustası',
    title_en: 'Stone-Oven Pizza Chef',
    dept_tr: 'Mutfak & Fırın',
    dept_en: 'Kitchen & Bakery',
    type_tr: 'Tam Zamanlı',
    type_en: 'Full Time',
    location_tr: 'İstanbul',
    location_en: 'Istanbul',
    description_tr: '24 cm taş fırın pizza reçetelerimizi özenle hazırlayacak, hamur ve mayalama süreçlerine hakim usta.',
    description_en: 'Artisan pizza maker experienced in high-temperature stone ovens and fermentation management.',
  },
  {
    id: 'pos-3',
    title_tr: 'Barista & Servis Sorumlusu',
    title_en: 'Specialty Coffee Barista & Service',
    dept_tr: 'Kahve & Salon',
    dept_en: 'Coffee & Front of House',
    type_tr: 'Tam / Yarı Zamanlı',
    type_en: 'Full / Part Time',
    location_tr: 'İstanbul',
    location_en: 'Istanbul',
    description_tr: 'Nitelikli kahve demleme tekniklerine hakim, güler yüzlü misafir deneyimini ön planda tutan çalışma arkadaşı.',
    description_en: 'Skilled in specialty espresso and latte art, bringing positive guest interaction and care.',
  },
  {
    id: 'pos-4',
    title_tr: 'Salon & Misafir Karşılama Ekip Üyesi',
    title_en: 'Front of House Host & Service',
    dept_tr: 'Salon & Misafir Deneyimi',
    dept_en: 'Guest Experience',
    type_tr: 'Tam / Yarı Zamanlı',
    type_en: 'Full / Part Time',
    location_tr: 'İstanbul',
    location_en: 'Istanbul',
    description_tr: 'Hızlı tempolu servis ortamında misafirlerimizi sıcak bir enerjiyle karşılayıp sipariş akışını koordine edecek ekip üyesi.',
    description_en: 'Warm, dynamic team member to greet guests, take orders, and ensure seamless dining flow.',
  },
];

export default function CareerPage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: OPEN_POSITIONS[0].title_tr,
    experience: '',
    message: '',
  });

  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkAccepted) return;
    // Pre-populate mailto link or trigger local submit
    const subject = encodeURIComponent(`İş Başvurusu: ${formData.position} - ${formData.fullName}`);
    const body = encodeURIComponent(
      `Ad Soyad: ${formData.fullName}\nE-posta: ${formData.email}\nTelefon: ${formData.phone}\nPozisyon: ${formData.position}\nDeneyim: ${formData.experience}\n\nÖn Yazı:\n${formData.message}`
    );
    window.location.href = `mailto:info@taamclub.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const careerSchema = {
    '@type': 'WebPage',
    '@id': 'https://taamclub.com/careers#webpage',
    'url': 'https://taamclub.com/careers',
    'name': lang === 'en' ? 'Careers at TAAM Club' : 'TAAM Club Kariyer',
    'description': lang === 'en' ? 'Explore job openings and join our culinary and hospitality team at TAAM Club Istanbul.' : 'TAAM Club iş ilanları ve kariyer fırsatları. Mutfak, servis ve barista kadromuza katılın.',
  };

  return (
    <>
      <SEOHead
        title={lang === 'tr' ? 'Kariyer & İş Başvuruları | TAAM Club Istanbul' : 'Careers & Job Opportunities | TAAM Club Istanbul'}
        description={lang === 'tr' ? 'TAAM Club ailesine katılın! Mutfak, taş fırın, servis ve barista pozisyonlarımız için açık iş ilanları ve doğrudan başvuru.' : 'Join the TAAM Club family! Open positions in kitchen, stone oven pizza, coffee and service teams in Istanbul.'}
        canonicalPath="/careers"
        breadcrumbs={[
          { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: '/' },
          { name: lang === 'tr' ? 'Kariyer' : 'Careers', item: '/careers' },
        ]}
        schema={careerSchema}
      />

      {/* ─── Hero Banner ─── */}
      <div className="bg-taam-blue pt-20 pb-16 md:pt-28 md:pb-20 relative overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        <div className="container-taam relative z-10">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-accent text-white/50 text-xs uppercase tracking-widest block mb-2"
          >
            — {t('careers.title', 'Kariyer & İş Başvuruları')}
          </motion.span>
          <div className="overflow-hidden mt-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-lg text-white leading-none"
            >
              {lang === 'tr' ? 'Birlikte Üretelim.' : 'Grow With Us.'}
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-accent text-white/80 text-base md:text-lg leading-relaxed mt-4 max-w-xl"
          >
            {t('careers.tagline', 'Bizimle birlikte lezzetin geleceğini şekillendirmek ister misiniz? Mutfaktan salona, her adımda tutkuyla çalışan bir aileyiz.')}
          </motion.p>
          <div className="mt-6">
            <TaamMotifs className="text-white/60" />
          </div>
        </div>
      </div>

      {/* ─── Culture & Perks ─── */}
      <div className="bg-white py-12 md:py-16 border-b border-taam-tile">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-taam-off-white border border-taam-tile">
              <div className="w-10 h-10 rounded-full bg-taam-blue text-white flex items-center justify-center mb-4">
                <UtensilsCrossed size={18} />
              </div>
              <h3 className="font-display text-taam-charcoal text-xl mb-2">
                {lang === 'tr' ? 'Gastronomi Tutkusu' : 'Culinary Passion'}
              </h3>
              <p className="font-accent text-taam-gray text-sm leading-relaxed">
                {lang === 'tr'
                  ? 'En kaliteli yerel malzemelerle, sıradanlıktan uzak ve gurme standartlarda üretim yapıyoruz.'
                  : 'We craft authentic flavors using premium ingredients and uncompromising quality.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-taam-off-white border border-taam-tile">
              <div className="w-10 h-10 rounded-full bg-taam-red text-white flex items-center justify-center mb-4">
                <Users size={18} />
              </div>
              <h3 className="font-display text-taam-charcoal text-xl mb-2">
                {lang === 'tr' ? 'Adil & Güçlü Ekip' : 'Supportive Culture'}
              </h3>
              <p className="font-accent text-taam-gray text-sm leading-relaxed">
                {lang === 'tr'
                  ? 'Birbirine saygılı, adil çalışma şartlarına inanan ve dayanışma içinde büyüyen bir takım ruhu.'
                  : 'A respectful, collaborative work atmosphere where teamwork and well-being come first.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-taam-off-white border border-taam-tile">
              <div className="w-10 h-10 rounded-full bg-taam-charcoal text-white flex items-center justify-center mb-4">
                <Sparkles size={18} />
              </div>
              <h3 className="font-display text-taam-charcoal text-xl mb-2">
                {lang === 'tr' ? 'Sürekli Gelişim' : 'Career Growth'}
              </h3>
              <p className="font-accent text-taam-gray text-sm leading-relaxed">
                {lang === 'tr'
                  ? 'Mutfak istasyonları, barista sanatları ve operasyon yönetiminde kendinizi geliştirebileceğiniz zemin.'
                  : 'Hands-on experience, professional culinary training, and leadership pathways.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Positions & Application Form ─── */}
      <div className="bg-taam-off-white section-padding">
        <div className="container-taam">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Open Positions List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="mb-6">
                <span className="font-accent text-taam-red text-xs uppercase tracking-widest block mb-1">
                  — {lang === 'tr' ? 'Fırsatlar' : 'Opportunities'}
                </span>
                <h2 className="text-display-md text-taam-charcoal leading-none">
                  {lang === 'tr' ? 'Açık Pozisyonlar' : 'Open Positions'}
                </h2>
                <p className="font-accent text-taam-gray text-sm mt-2">
                  {lang === 'tr'
                    ? 'İlgilendiğiniz pozisyonu seçerek hemen yandaki formdan veya e-posta yoluyla başvurabilirsiniz.'
                    : 'Select your preferred position and submit the quick form or email us directly.'}
                </p>
              </div>

              {OPEN_POSITIONS.map((pos) => {
                const title = lang === 'en' ? pos.title_en : pos.title_tr;
                const dept = lang === 'en' ? pos.dept_en : pos.dept_tr;
                const type = lang === 'en' ? pos.type_en : pos.type_tr;
                const loc = lang === 'en' ? pos.location_en : pos.location_tr;
                const desc = lang === 'en' ? pos.description_en : pos.description_tr;

                return (
                  <div
                    key={pos.id}
                    onClick={() => setFormData({ ...formData, position: title })}
                    className="p-6 bg-white rounded-2xl border border-taam-tile hover:border-taam-blue transition-all duration-200 cursor-pointer shadow-xs group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-accent uppercase tracking-wider text-taam-red font-semibold">
                        {dept}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-accent text-taam-gray">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {type}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {loc}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-taam-charcoal text-xl group-hover:text-taam-blue transition-colors">
                      {title}
                    </h3>
                    <p className="font-accent text-taam-gray text-sm leading-relaxed mt-2">
                      {desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-taam-tile flex items-center justify-between">
                      <span className="text-xs font-accent text-taam-blue font-semibold">
                        {lang === 'tr' ? 'Bu pozisyona başvur →' : 'Apply for this role →'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Direct email box */}
              <div className="p-6 rounded-2xl bg-taam-blue text-white mt-6">
                <h4 className="font-display text-xl mb-1">
                  {lang === 'tr' ? 'Doğrudan CV Gönderimi' : 'Direct CV Submission'}
                </h4>
                <p className="font-accent text-white/70 text-sm mb-3">
                  {lang === 'tr'
                    ? 'CV ve portfolyonuzu doğrudan resmi kariyer adresimize iletebilirsiniz:'
                    : 'You can also send your resume and details directly to our careers mailbox:'}
                </p>
                <a
                  href="mailto:info@taamclub.com?subject=Kariyer Başvurusu"
                  className="font-display text-white text-lg underline hover:text-white/80 transition-colors"
                >
                  info@taamclub.com
                </a>
              </div>
            </div>

            {/* Right: Application Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-taam-tile p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="font-display text-taam-charcoal text-2xl leading-none">
                  {lang === 'tr' ? 'Hızlı Başvuru Formu' : 'Fast Application Form'}
                </h3>
                <p className="font-accent text-taam-gray text-xs mt-1">
                  {lang === 'tr'
                    ? 'Bilgilerinizi doldurarak ilk adımı atın.'
                    : 'Fill in your details to start the conversation.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                  <CheckCircle2 size={36} className="text-green-600 mx-auto mb-2" />
                  <h4 className="font-display text-green-900 text-lg mb-1">
                    {lang === 'tr' ? 'Başvurunuz Hazırlandı!' : 'Application Prepared!'}
                  </h4>
                  <p className="font-accent text-green-800 text-sm leading-relaxed">
                    {lang === 'tr'
                      ? 'E-posta uygulamanız açılarak bilgileriniz info@taamclub.com adresine yönlendirildi. Ekibimiz sizinle en kısa sürede iletişime geçecektir.'
                      : 'Your details were formatted to info@taamclub.com. Our team will review and get in touch with you.'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-taam btn-taam-outline text-xs mt-4"
                  >
                    {lang === 'tr' ? 'Yeni Başvuru' : 'New Application'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-accent">
                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'Adınız Soyadınız' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm"
                      placeholder={lang === 'tr' ? 'Örn: Ahmet Yılmaz' : 'e.g. John Doe'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'E-posta Adresiniz' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm"
                      placeholder="adiniz@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'Telefon Numaranız' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'Başvurulan Pozisyon' : 'Target Position'} *
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm bg-white"
                    >
                      {OPEN_POSITIONS.map((p) => (
                        <option key={p.id} value={lang === 'en' ? p.title_en : p.title_tr}>
                          {lang === 'en' ? p.title_en : p.title_tr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'İlgili Sektör Deneyimi' : 'Experience Level'}
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm bg-white"
                    >
                      <option value="Deneyimsiz / Yeni Başlayan">{lang === 'tr' ? 'Deneyimsiz / Öğrenmeye Açık' : 'Entry Level / Eager to Learn'}</option>
                      <option value="1-2 Yıl">{lang === 'tr' ? '1 – 2 Yıl' : '1 – 2 Years'}</option>
                      <option value="3-5 Yıl">{lang === 'tr' ? '3 – 5 Yıl' : '3 – 5 Years'}</option>
                      <option value="5+ Yıl">{lang === 'tr' ? '5+ Yıl' : '5+ Years'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-taam-charcoal mb-1">
                      {lang === 'tr' ? 'Kendinizi Tanıtın / Ön Yazı' : 'Cover Letter / About You'}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-taam-tile focus:outline-none focus:border-taam-blue text-sm"
                      placeholder={lang === 'tr' ? 'Önceki çalışma deneyimleriniz ve eklemek istedikleriniz...' : 'Brief summary of your past culinary or hospitality experience...'}
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-taam-blue flex-shrink-0"
                    />
                    <span className="text-[11px] text-taam-gray leading-relaxed">
                      {lang === 'tr'
                        ? '6698 sayılı KVKK kapsamında iş başvurumun değerlendirilmesi amacıyla kimlik, iletişim ve mesleki deneyim verilerimin işlenmesine ilişkin Çalışan Adayı Aydınlatma Metni’ni okudum ve anladım. *'
                        : 'I have read and understood the Candidate Privacy Notice regarding the processing of my identity, contact, and professional experience data for evaluating my job application under KVKK No. 6698. *'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!kvkkAccepted}
                    className="btn-taam btn-taam-red w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={15} />
                    {lang === 'tr' ? 'Başvuruyu Gönder' : 'Send Application'}
                  </button>

                  <p className="text-[11px] text-taam-gray text-center leading-normal">
                    {lang === 'tr'
                      ? 'Başvurunuz info@taamclub.com adresine güvenle iletilecektir.'
                      : 'Your application details will be forwarded to info@taamclub.com.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

