# CANLIYA GEÇİŞ VE DAĞITIM KONTROL LİSTESİ (PRODUCTION DEPLOYMENT CHECKLIST)

**Son Güncelleme:** 2026-11-02  
**Proje:** TAAM Club (`taam-club`)  
**Hedef Ortam:** Vercel (Production) + Supabase (Production)

---

## 1. Dağıtım Öncesi Teknik Kontroller (Pre-Deployment Technical Checks)

- [x] **TypeScript Derleme Kontrolü (`tsc -b`):** Sıfır hata ile tamamlandı (`tsconfig.app.json` içindeki `ignoreDeprecations` / `baseUrl` uyumsuzluğu giderildi).
- [x] **Statik Kod Analizi (`npm run lint`):** `oxlint` 22 dosyada **0 uyarı, 0 hata** ile geçti.
- [x] **Üretim Derlemesi (`npm run build`):** Vite 8 üretim paketi başarıyla oluşturuldu; `React.lazy()` kod bölme ile ana paket boyutu 500 kB sınırının altına (`468.25 kB`) indirildi.
- [x] **Vektörel Marka Logosu:** Orijinal Adobe Illustrator vektör koordinatları `src/components/ui/Logo.tsx`, `public/taam-logo.svg` ve `public/favicon.svg` dosyalarına işlendi.
- [x] **HTTP Güvenlik Başlıkları (`vercel.json`):** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` ve `Strict-Transport-Security` yapılandırıldı.
- [x] **SEO & GEO Dosyaları:** `public/robots.txt`, `public/sitemap.xml` ve `public/llms.txt` tüm rotaları (`/`, `/menu`, `/about`, `/careers`, `/contact`) kapsayacak şekilde güncellendi.

---

## 2. Supabase Veritabanı ve Güvenlik Kurulumu (Zorunlu Adımlar)

- [ ] **1. Canlı Supabase Projesi Oluşturma:** Supabase Dashboard üzerinde üretim projesi (`eu-central-1` Frankfurt gibi yakın bir bölge) oluşturuldu.
- [ ] **2. Veritabanı Şemasını Çalıştırma:** `supabase/migrations/001_init.sql` dosyası Supabase SQL Editor'de çalıştırıldı (`categories`, `products`, `instagram_posts`, `site_settings` tabloları oluştu).
- [ ] **3. Açık Kullanıcı Kaydını (Public Signup) Kapatma (`[CRITICAL/HIGH]`):**
  - Supabase Dashboard → **Authentication → Providers → Email** bölümünden **"Allow new users to sign up"** seçeneği **KAPATILDI (Disabled)**.
- [ ] **4. Yönetici Kullanıcısı Oluşturma:**
  - Supabase Dashboard → **Authentication → Users** üzerinden `info@taamclub.com` (veya yetkili yönetici e-postası) için güçlü bir parola ile kullanıcı oluşturuldu.
- [ ] **5. RLS Admin Rol Politikalarını Uygulama (`[HIGH-01]`):**
  - `docs/DATA_SECURITY_POLICY.md` Bölüm 2'de yer alan `public.is_admin()` fonksiyonu ve sıkılaştırılmış RLS politikaları Supabase SQL Editor'de çalıştırıldı.
- [ ] **6. Otomatik Yedekleme:** Supabase üzerinde günlük veritabanı yedeklemesi aktif edildi.

---

## 3. Vercel Ortam Değişkenleri ve Alan Adı Kurulumu

- [ ] **1. Ortam Değişkenlerini Tanımlama:**
  Vercel Dashboard → **Project Settings → Environment Variables** altında (Production, Preview, Development):
  - `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = `<anon-public-jwt-key>`
  *(Uyarı: `service_role` gizli anahtarı kesinlikle buraya eklenmemelidir!)*
- [ ] **2. Özel Alan Adı (Custom Domain) Bağlama:**
  - `taamclub.com` ve `www.taamclub.com` DNS kayıtları Vercel'e yönlendirildi.
  - SSL/TLS sertifikasının otomatik olarak üretildiği doğrulandı.
- [ ] **3. Demo Modunun Kapandığını Doğrulama:**
  - Canlı ortamda `https://taamclub.com/admin` adresine gidildiğinde *"Demo Modu Aktif"* kutusunun **görünmediği**, yalnızca gerçek Supabase e-posta/şifre girişinin çalıştığı teyit edildi.

---

## 4. Hukuki, İçerik ve SEO Canlıya Geçiş Sonrası Kontroller

- [ ] **1. KVKK Bilgilerinin Tamamlanması:** `docs/BUSINESS_INPUT_REQUIRED.md` listesindeki şirket unvanı, MERSİS no ve açık adres bilgileri `docs/KVKK_AYDINLATMA_METNI.md` içinde dolduruldu ve sitede yayınlandı.
- [ ] **2. Gerçek Ürün Fotoğrafları:** `src/data/demo.ts` ve Supabase `products` tablosundaki Unsplash yer tutucu görselleri TAAM Club'ın kendi telifli ürün fotoğraflarıyla değiştirildi.
- [ ] **3. Yazı Tiplerinin Yerelleştirilmesi (Self-Hosting):** `Anton`, `Inter` ve `Manrope` yazı tipleri `public/fonts/` altına `.woff2` olarak taşındı.
- [ ] **4. Google Search Console & Bing Webmaster Tools:**
  - `https://taamclub.com` mülkü doğrulandı.
  - `https://taamclub.com/sitemap.xml` site haritası gönderildi.
