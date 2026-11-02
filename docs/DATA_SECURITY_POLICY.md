# VERİ GÜVENLİĞİ POLİTİKASI VE TEKNİK DENETİM RAPORU (DATA SECURITY POLICY)

**Son Güncelleme:** 2026-11-02  
**Kapsam:** `taam-club` Web Uygulaması, Supabase Veritabanı ve Vercel Barındırma Altyapısı  
**Dayanak:** 6698 Sayılı KVKK Madde 12 (Veri Güvenliğine İlişkin Yükümlülükler) ve Kişisel Verileri Koruma Kurumu Teknik ve İdari Tedbirler Rehberi

---

## 1. Güvenlik Kontrolleri Denetim Tablosu (Mevcut Durum ve Bulgular)

Aşağıdaki tablo, projedeki 19 güvenlik kontrol alanının gerçek kod tabanı üzerindeki denetim sonuçlarını ve önem derecelerini (`CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `COMPLIANT`) göstermektedir:

| Kontrol Alanı | Durum | Önem Derecesi | Kanıt / Dosya Referansı | Değerlendirme ve Aksiyon |
|---|---|---|---|---|
| **1. Parola Özeti (Password Hashing)** | Uygun | `COMPLIANT` | Supabase Auth (`auth.users`) | Parolalar uygulama katmanında tutulmaz; Supabase Auth (GoTrue) tarafından `bcrypt` ile özetlenir. |
| **2. Kimlik Doğrulama & Oturum Güvenliği** | Uygun (Canlı) / Uyarı (Demo) | `HIGH` | `src/pages/AdminPage.tsx:34-41, 706-724` | Supabase aktifken `signInWithPassword` kullanılır. Supabase ortam değişkenleri girilmezse Demo Modu (`localStorage.taam_demo_auth`) devreye girer. Canlı ortamda `VITE_SUPABASE_*` değişkenleri zorunlu olmalıdır. |
| **3. JWT Süresi ve Yenileme (Refresh)** | Uygun | `COMPLIANT` | `@supabase/supabase-js` (`src/lib/supabase/client.ts:20-21`) | Supabase istemcisi kısa ömürlü Access Token (varsayılan 1 saat) ve otomatik Refresh Token rotasyonu uygular. |
| **4. Rol Tabanlı Erişim Kontrolü (RBAC) & RLS** | İyileştirme Gerekli | `HIGH` | `supabase/migrations/001_init.sql:108-147` | Mevcut RLS politikaları `TO authenticated USING (true)` şeklindedir. Supabase'de açık kayıt (Public Signup) kapatılmalı ve `app_metadata.role = 'admin'` kontrolü eklenmelidir (Bkz. Bölüm 2). |
| **5. Veritabanı İzinleri** | Uygun | `COMPLIANT` | `supabase/migrations/001_init.sql:101-148` | Tüm tablolarda (`categories`, `products`, `instagram_posts`, `site_settings`) `ENABLE ROW LEVEL SECURITY` aktiftir; anonim kullanıcılar yalnızca `SELECT` yapabilir. |
| **6. API Hız Sınırlama (Rate Limiting)** | Kısmi | `LOW` | Supabase Auth & Vercel Edge | Supabase Auth giriş denemelerinde yerleşik rate-limit uygular. Okuma sorguları CDN/istemci üzerinden yapılır. |
| **7. Girdi Doğrulama (Input Validation)** | İyileştirme Gerekli | `MEDIUM` | `src/pages/AdminPage.tsx:263-297`, `src/pages/CareerPage.tsx:331-425` | Kariyer formunda HTML5 `required`, `type="email"`, `type="tel"` doğrulaması vardır. Admin panelinde URL alanları (`image_url`, `instagram_url`) için `https://` şema kontrolü eklenmelidir. |
| **8. SQL Enjeksiyonu (SQLi) Önleme** | Uygun | `COMPLIANT` | `src/lib/supabase/queries.ts` | Ham SQL sorgusu kullanılmamaktadır; tüm sorgular `@supabase/supabase-js` parametreli PostgREST API'si üzerinden yürütülür. |
| **9. XSS (Cross-Site Scripting) Koruması** | Uygun | `LOW` | Tüm `.tsx` dosyaları | React JSX tüm metin çıktılarını otomatik olarak escape eder. `dangerouslySetInnerHTML` hiçbir dosyada kullanılmamıştır (`SEOHead.tsx` içindeki JSON-LD `JSON.stringify` ile üretilir). |
| **10. CSRF Koruması** | Uygun | `COMPLIANT` | `@supabase/supabase-js` | Kimlik doğrulama çerez yerine `Authorization: Bearer <JWT>` başlığı ile çalıştığından klasik CSRF saldırılarına karşı bağışıktır. |
| **11. CORS Yapılandırması** | Yapılandırma Gerekli | `LOW` | Supabase Dashboard / `vercel.json` | Supabase Auth Redirect URLs listesinde yalnızca `https://taamclub.com` tanımlanmalıdır. |
| **12. HTTPS Zorunluluğu** | Uygun | `COMPLIANT` | `vercel.json:21-24` | Vercel otomatik TLS/HTTPS sağlar ve `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` başlığı eklenmiştir. |
| **13. Güvenli Çerezler (Secure Cookies)** | Uygun | `COMPLIANT` | Uygulama genelinde | Uygulama birinci taraf takip çerezi oluşturmaz; yalnızca Google Maps iframe'i `/contact` sayfasında üçüncü taraf çerez kullanabilir. |
| **14. Hassas Bilgi İfşası** | Uygun | `COMPLIANT` | `.env.example`, `.gitignore:16-18` | Kod tabanında veya Git geçmişinde hiçbir özel anahtar (`service_role` vb.) bulunmamaktadır. |
| **15. Loglama ve İzleme** | Temel Düzeyde | `LOW` | Vercel Logs & Supabase Logs | Uygulama içinde hassas kişisel veri (`console.log(formData)`) loglanmamaktadır. |
| **16. Yedekleme ve Kurtarma** | İşletme Aksiyonu | `MEDIUM` | Supabase Dashboard | Canlı veritabanı için Supabase günlük otomatik yedekleme (Point-in-Time Recovery / Daily Backups) aktif edilmelidir. |
| **17. Ortam Değişkeni Koruması** | Uygun | `COMPLIANT` | `.gitignore`, `src/lib/supabase/client.ts` | `.env` ve `.env.*` dosyaları Git'ten hariç tutulmuştur. |
| **18. Üçüncü Taraf API Güvenliği** | İyileştirme Gerekli | `MEDIUM` | `index.html:34-36`, `src/pages/ContactPage.tsx:151` | Google Fonts ve Unsplash görselleri dış CDN'den yüklenmektedir; yerel barındırma (self-hosting) önerilir. |
| **19. HTTP Güvenlik Başlıkları** | Uygun | `COMPLIANT` | `vercel.json:2-26` | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` ve `HSTS` tanımlanmıştır. |

---

## 2. Supabase RLS Sıkılaştırma (Hardening) SQL Betiği (`[HIGH-01]` Çözümü)

Canlı Supabase projesinde herhangi bir kimliği doğrulanmış kullanıcının değil, **yalnızca `admin` rolüne sahip yöneticilerin** veri değiştirebilmesi için Supabase SQL Editor'de aşağıdaki sıkılaştırma betiği çalıştırılmalıdır:

```sql
-- 1. Yönetici kontrol fonksiyonu (JWT app_metadata üzerinden)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Mevcut geniş yetkili politikaları kaldırıp yalnızca admin'e yetki verme
DROP POLICY IF EXISTS "Authenticated users have full access to categories" ON categories;
CREATE POLICY "Only admins have full access to categories"
  ON categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users have full access to products" ON products;
CREATE POLICY "Only admins have full access to products"
  ON products FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users have full access to instagram posts" ON instagram_posts;
CREATE POLICY "Only admins have full access to instagram posts"
  ON instagram_posts FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Admin kullanıcısına 'admin' rolü atama (info@taamclub.com için çalıştırın)
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'info@taamclub.com';
```

---

## 3. İdari ve Teknik Veri Güvenliği Kuralları (KVKK Madde 12)

1. **En Az Yetki Prensibi (Least Privilege):**
   - `/admin` paneline ve `info@taamclub.com` e-posta kutusuna yalnızca yetkilendirilmiş restoran yöneticisi ve İK sorumlusu erişebilir.
   - `info@taamclub.com` e-posta hesabı ve Supabase Dashboard hesaplarında **İki Faktörlü Doğrulama (2FA / MFA)** zorunludur.
2. **İletişim ve Aktarım Güvenliği:**
   - Tüm web trafiği TLS 1.2/1.3 (HTTPS) üzerinden şifrelenir (`Strict-Transport-Security` aktif).
   - Kariyer başvuruları sunucu veritabanında açık metin olarak bekletilmez; doğrudan başvuru sahibinin e-posta istemcisinden kurumsal e-posta adresine iletilir.
3. **Çalışan Adayı Verilerinin İmhası:**
   - `info@taamclub.com` adresine gelen özgeçmiş ve iş başvurusu e-postaları, işe alım süreci tamamlandıktan veya belirlenen saklama süresi (`[REQUIRES BUSINESS INPUT: Örn. 6 ay]`) dolduktan sonra e-posta kutusundan ve yedeklerden kalıcı olarak silinir.
