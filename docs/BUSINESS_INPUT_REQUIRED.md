# İŞLETME VE HUKUK BİRİMİNDEN BEKLENEN BİLGİLER (BUSINESS INPUT REQUIRED)

**Son Güncelleme:** 2026-11-02  
**Durum:** Canlıya Geçiş Öncesi Tamamlanması Zorunlu Bilgiler Listesi

Bu belge, denetim sırasında uydurulmaması (fabricate edilmemesi) gereken ve doğrudan **TAAM Club işletme yönetimi / hukuk müşaviri** tarafından sağlanması gereken tüm bilgileri tek bir tabloda toplar.

---

## 1. Kurumsal ve Hukuki Kimlik Bilgileri (KVKK & Yasal Metinler İçin)

| # | Bilgi Kalemi | Kullanılacağı Yer | Mevcut Durum | İşletmeden Beklenen Girdi |
|---|---|---|---|---|
| **1** | **Resmi Ticari Unvan** | `docs/KVKK_AYDINLATMA_METNI.md`, Footer, İlerideki Yasal Sayfalar | Eksik (`TAAM Club` marka adı kullanılıyor) | `[REQUIRES BUSINESS INPUT: Örn. ... Gıda ve Turizm San. Tic. A.Ş. / Ltd. Şti.]` |
| **2** | **MERSİS Numarası** | KVKK Aydınlatma Metni, İlerideki Ön Bilgilendirme Formu | Eksik | `[REQUIRES BUSINESS INPUT: 16 haneli MERSİS No]` |
| **3** | **Vergi Dairesi ve Vergi Numarası** | Kurumsal Künye /KVKK Başvuru Bilgileri | Eksik | `[REQUIRES BUSINESS INPUT: Vergi Dairesi ve 10 haneli VKN]` |
| **4** | **KEP (Kayıtlı Elektronik Posta) Adresi** | KVKK Madde 13 Başvuru Yöntemleri | Eksik | `[REQUIRES BUSINESS INPUT: sirket@hs01.kep.tr]` |
| **5** | **KVKK Veri Sorumlusu İrtibat Kişisi** | `docs/DATA_BREACH_RESPONSE_PLAN.md` | Eksik | `[REQUIRES BUSINESS INPUT: Ad Soyad, Unvan, Dahili İletişim]` |

---

## 2. Konum ve İletişim Bilgileri (SEO, GEO & Harita Tutarlılığı İçin)

| # | Bilgi Kalemi | Kullanılacağı Yer | Mevcut Durum | İşletmeden Beklenen Girdi |
|---|---|---|---|---|
| **6** | **Tam Açık Restoran Adresi** | `ContactPage.tsx`, `Footer.tsx`, `SEOHead.tsx`, `public/llms.txt` | Yalnızca `"İstanbul, Türkiye"` veya `"Güzide Mertcan, Istanbul"` yazıyor | `[REQUIRES BUSINESS INPUT: Mahalle, Cadde/Sokak, Kapı No, İlçe, Posta Kodu, İstanbul]` |
| **7** | **Doğrulanmış GPS Koordinatları** | `SEOHead.tsx:82-83`, `public/llms.txt:9` | `SEOHead.tsx` içinde `41.0082, 28.9784` (varsayılan İstanbul koordinatı), Google Maps iframe içinde `41.0614, 28.8687` bulunuyor | `[REQUIRES BUSINESS INPUT: Restoranın tam Enlem (Latitude) ve Boylam (Longitude) değeri]` |

---

## 3. Teknik Altyapı ve Veri İşleme Kararları

| # | Bilgi Kalemi | Kullanılacağı Yer | Mevcut Durum | İşletmeden Beklenen Girdi |
|---|---|---|---|---|
| **8** | **Canlı Supabase Proje Bilgileri** | Vercel Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) | `.env.example` içinde yer tutucu mevcut | `[REQUIRES BUSINESS INPUT: Canlı Supabase URL ve Anon Key]` |
| **9** | **E-Posta (`info@taamclub.com`) Sunucu Konumu** | `docs/KVKK_AYDINLATMA_METNI.md` (KVKK m.9 Yurt Dışı Aktarım) | Bilinmiyor | `[REQUIRES BUSINESS INPUT: E-posta sunucuları Türkiye içinde mi yoksa yurt dışında (Google Workspace / Microsoft 365 vb.) mı barındırılıyor?]` |
| **10** | **Çalışan Adayı Özgeçmiş Saklama Süresi** | `docs/KVKK_AYDINLATMA_METNI.md` Bölüm 3 | Taslakta boş bırakıldı | `[REQUIRES BUSINESS INPUT: Olumsuz sonuçlanan iş başvurularının saklanma süresi, örn. 6 ay veya 1 yıl]` |
| **11** | **Telifli Ürün Fotoğrafları** | `src/data/demo.ts`, `index.html` (`og:image`), Supabase `products` | Unsplash stok görselleri kullanılıyor | `[REQUIRES BUSINESS INPUT: TAAM Club'a ait gerçek ürün fotoğrafları ve 1200x630 Open Graph görseli]` |
| **12** | **Google Search Console Doğrulama Kodu** | `index.html` veya DNS TXT kaydı | Henüz eklenmedi | `[REQUIRES BUSINESS INPUT: google-site-verification kodu]` |
