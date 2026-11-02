# TEKNİK SEO, YAZI TİPİ (FONT) GÜVENLİĞİ VE GEO (GENERATIVE ENGINE OPTIMIZATION) DENETİM RAPORU

**Son Güncelleme:** 2026-11-02  
**Kapsam:** `taam-club` (`https://taamclub.com`)

---

## 1. Yazı Tipi Barındırma ve Varlık Güvenliği Denetimi (Font Hosting & Asset Security)

### 1.1 Mevcut Durum Tespiti
`index.html` (satır 34–36) ve `src/index.css` (satır 24–26) incelendiğinde aşağıdaki yapılandırma tespit edilmiştir:

```html
<!-- index.html:34-36 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

| Kriter | Durum | Kanıt / Detay |
|---|---|---|
| **Kullanılan Yazı Tipleri** | `Anton` (Display), `Inter` (Body), `Manrope` (Accent) | `src/index.css:24-26` |
| **Font Lisansları** | Açık Kaynak (SIL Open Font License 1.1) | Üç yazı tipi de ticari kullanıma ve yerel barındırmaya (self-hosting) tamamen uygundur. |
| **Google Fonts Bağımlılığı** | Mevcut (Dış İstek) | Sayfa açılışında `fonts.googleapis.com` ve `fonts.gstatic.com` adreslerine dış HTTP isteği yapılır. |
| **WOFF2 Yerel Barındırma** | Eksik (Önerilir) | `public/fonts/` dizini henüz oluşturulmamıştır. |
| **`font-display` Ayarı** | `swap` (Uygun) | Google Fonts URL parametresinde `&display=swap` aktif. |
| **Üçüncü Taraf Görseller** | Unsplash CDN (`images.unsplash.com`) | `src/data/demo.ts`, `index.html:21`, `src/pages/HomePage.tsx` içinde yer tutucu ürün fotoğrafları Unsplash üzerinden çekilmektedir. |
| **Harici Takip / Analitik Betikleri** | Yok (Temiz) | Kod tabanında Google Analytics, Meta Pixel veya üçüncü taraf reklam/izleme betiği bulunmamaktadır. |

### 1.2 Yerel WOFF2 Barındırma (Self-Hosting) Önerisi
Hem **KVKK yurt dışı IP aktarımı** riskini azaltmak hem de **LCP / FCP (Core Web Vitals)** performansını iyileştirmek için:
1. `Anton` (400), `Inter` (400, 500, 600, 700) ve `Manrope` (600, 700) fontlarının `.woff2` (`latin` ve `latin-ext`) dosyaları `public/fonts/` klasörüne indirilmelidir (SIL OFL 1.1 lisansı buna izin verir).
2. `index.html` içindeki `fonts.googleapis.com` bağlantıları kaldırılıp `src/index.css` içine `@font-face` tanımları eklenmelidir.

---

## 2. Teknik SEO Denetimi (Technical SEO Audit)

| SEO Kontrol Noktası | Durum | Kanıt / Dosya Referansı | Değerlendirme |
|---|---|---|---|
| **Benzersiz `<title>` Etiketleri** | Tamamlandı | `src/components/seo/SEOHead.tsx:45, 139` | Her sayfada TR ve EN diline duyarlı, 60 karakter bütçesine uygun benzersiz başlık üretilir. |
| **Meta Açıklamalar (`description`)** | Tamamlandı | `src/components/seo/SEOHead.tsx:46, 140` | Her sayfada 155 karakter sınırına göre optimize edilmiş açıklama bulunur. |
| **Canonical URL** | Tamamlandı | `src/components/seo/SEOHead.tsx:39-40, 148` | Sondaki eğik çizgileri normalize eden (`https://taamclub.com/menu` vb.) dinamik canonical yapısı mevcuttur. |
| **`robots.txt`** | Tamamlandı | `public/robots.txt` | `/`, `/menu`, `/about`, `/careers`, `/kariyer`, `/contact` izinli; `/admin` ve `/admin/*` engelli. |
| **XML Sitemap (`sitemap.xml`)** | Tamamlandı | `public/sitemap.xml` | 5 ana rotayı (`/`, `/menu`, `/about`, `/careers`, `/contact`) ve `xhtml:link` hreflang alternatiflerini içerir. |
| **Open Graph & Twitter Cards** | Tamamlandı | `index.html:15-31`, `src/components/seo/SEOHead.tsx:153-170` | `og:title`, `og:description`, `og:image` (1200×630), `og:locale` (`tr_TR` / `en_US`) ve `summary_large_image` tanımlıdır. |
| **Yapısal Veri (JSON-LD `@graph`)** | Tamamlandı | `src/components/seo/SEOHead.tsx:49-131, 173-175` | `WebSite`, `Restaurant`, `FastFoodRestaurant`, `BreadcrumbList`, `Menu`, `FAQPage`, `ContactPage`, `AboutPage` şemaları üretilir. |
| **Çok Dilli `hreflang` Yapısı** | Kısmi (Zustand Tabanlı) | `src/components/seo/SEOHead.tsx:41-42, 149-151` | `hreflang="tr"`, `hreflang="en"` (`?lang=en`) ve `hreflang="x-default"` etiketleri mevcuttur. **Teknik Not:** `useLang.ts` şu anda URL parametresini (`?lang=en`) okumamaktadır; tam çok dilli indeksleme için `useLang.ts` içinde `?lang=en` sorgu parametresi okunmalı veya `/en/...` alt rotaları eklenmelidir. |
| **Görsel `alt` Öznitelikleri** | Tamamlandı | Tüm sayfa bileşenleri | Tüm `<img>` etiketlerinde anlamlı `alt` metinleri ve dekoratif öğelerde `aria-hidden="true"` kullanılmıştır. |
| **Başlık Hiyerarşisi (`h1`–`h3`)** | Tamamlandı | `HomePage.tsx`, `MenuPage.tsx`, `AboutPage.tsx`, `CareerPage.tsx`, `ContactPage.tsx` | Her sayfada tek bir ana başlık (veya erişilebilir marka başlığı) ve mantıksal `h2` → `h3` hiyerarşisi vardır. |
| **404 Sayfası ve `noindex`** | Tamamlandı | `src/pages/NotFoundPage.tsx:10-15`, `src/pages/AdminPage.tsx:760` | Hem `NotFoundPage` hem de `AdminPage` üzerinde `<meta name="robots" content="noindex, nofollow" />` aktiftir. |
| **Core Web Vitals & Kod Bölme** | İyileştirildi | `src/App.tsx:7-13`, `vercel.json:27-35` | `React.lazy()` ile rota bazlı kod bölme uygulandı; ana JS paketi `640 kB` → `468 kB` seviyesine düşürüldü. |
| **Google Search Console Durumu** | İşletme Aksiyonu Bekliyor | `README.md:276-286` | Alan adı (`taamclub.com`) DNS/HTML doğrulaması henüz yapılmamıştır (`[REQUIRES BUSINESS INPUT]`). |

---

## 3. GEO (Generative Engine Optimization) Denetimi

Web sitesinin **ChatGPT Search (OAI-SearchBot)**, **Google AI Overviews**, **Perplexity (PerplexityBot)** ve **Claude (ClaudeBot)** gibi yanıt motorları tarafından anlaşılabilirliği incelenmiştir:

### 3.1 Güçlü Yönler (Uygulanan Özellikler)
1. **`public/llms.txt` Standardı:**
   - Marka kimliği, koordinatlar, `info@taamclub.com` e-posta adresi, Google Maps bağlantısı, çalışma saatleri, 10 imza menü ürünü (fiyatlarıyla birlikte) ve sıkça sorulan sorular makine tarafından okunabilir Markdown formatında sunulmuştur.
2. **Yapay Zekâ Bot İzinleri (`public/robots.txt`):**
   - `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `cohere-ai` botlarına açıkça izin verilmiş, `/admin` dizini kapatılmıştır.
3. **Semantik HTML ve Yüksek Yoğunluklu Bilgi Tabloları (`<table>`):**
   - `HomePage.tsx` (Kurumsal & Mutfak Özeti Tablosu + SSS), `MenuPage.tsx` (Menü Standartları ve Fiyat Tablosu), `AboutPage.tsx` (Gastronomi Standartları Tablosu) ve `ContactPage.tsx` (Resmî İletişim & Çalışma Saatleri Tablosu) üzerinde LLM'lerin doğrudan ayrıştırabileceği `<th>`/`<td>` tabloları yer almaktadır.

### 3.2 Tespit Edilen Tutarsızlıklar ve İyileştirme Gereksinimleri
1. **Adres ve Koordinat Tutarlılığı (`[REQUIRES BUSINESS INPUT]`):**
   - `SEOHead.tsx:75-83`, `HomePage.tsx:212, 764` ve `public/llms.txt:9, 40` içinde adres `"Güzide Mertcan, Istanbul"` ve koordinat `41.0082, 28.9784` (Fatih/Tarihi Yarımada) olarak geçerken, `ContactPage.tsx:151` içindeki gömülü Google Maps iframe'i `41.0614, 28.8687` koordinatlarını göstermektedir.
   - Yapay zekâ arama motorlarının (GEO) yerel işletme varlığını (Entity Resolution) yüksek güven skoruyla doğrulayabilmesi için **resmî açık adres (Mahalle, Cadde, No, İlçe, Posta Kodu)** ve **tam GPS koordinatları** tüm dosyalarda (`SEOHead.tsx`, `llms.txt`, `ContactPage.tsx`, `HomePage.tsx`) birebir aynı olmalıdır.
2. **İstemci Tarafı Render (CSR) Kısıtı:**
   - Uygulama Vite + React SPA olarak çalıştığından, JavaScript çalıştırmayan basit HTTP botları yalnızca `index.html` içindeki başlangıç meta etiketlerini ve `public/llms.txt` dosyasını görür. Googlebot ve modern arama motorları JS render edebilmektedir; ancak AI botları için `public/llms.txt` dosyasının güncel tutulması kritik önem taşır.

