# TİCARİ ELEKTRONİK İLETİ ONAYI VE İYS UYUM REHBERİ (COMMERCIAL ELECTRONIC COMMUNICATION CONSENT)

**Son Güncelleme:** 2026-11-02  
**Yasal Dayanak:** 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun (“**ETK**”), Ticari İletişim ve Ticari Elektronik İletiler Hakkında Yönetmelik ve 6698 Sayılı KVKK

---

## 1. Mevcut Proje Durumu (Teknik Denetim Tespiti)

`taam-club` kaynak kodu (`src/pages/*`, `src/components/*`) incelendiğinde:
- **Mevcut Durum:** Web sitesinde **e-bülten aboneliği (newsletter), kampanya/indirim duyurusu, SMS aboneliği veya pazarlama amaçlı veri toplama formu BULUNMAMAKTADIR.**
- `/careers` sayfasındaki form (`src/pages/CareerPage.tsx`) yalnızca **iş başvurusu** amacı taşımakta olup pazarlama iletişimi amacıyla kullanılmamaktadır.
- **Sonuç:** Mevcut sürümde ziyaretçilerden ticari elektronik ileti onayı alınmasını gerektiren bir akış yoktur ve iş başvurusu formu üzerinden adaylara reklam/kampanya iletisi gönderilmemelidir.

---

## 2. Gelecekte Kampanya / Bülten / Sadakat Kulübü Eklenmesi Halinde Uyulacak Kurallar

İleride web sitesine *"TAAM Club Haberdar Ol / Kampanya Bülteni"* veya online sipariş/üyelik formu eklendiğinde aşağıdaki hukuki ve teknik kuralların uygulanması zorunludur:

1. **Ön Koşul Olmama (Unbundled Consent) Kuralı:**
   - Ticari elektronik ileti onayı, **asla** iş başvurusu, üyelik kaydı, rezervasyon veya KVKK Aydınlatma Metni okuma beyanı ile tek bir onay kutusunda birleştirilemez.
   - Kullanıcı, ticari ileti onayı vermeden de sitedeki temel hizmetlerden yararlanabilmelidir.
2. **Varsayılan Olarak İşaretsiz Olma (Opt-in):**
   - Onay kutucuğu (checkbox) sayfa yüklendiğinde **boş (seçilmemiş)** olarak gelmelidir. Önceden işaretlenmiş (pre-checked) kutular hukuken geçersizdir.
3. **Kanal Bazlı Ayrı Onay:**
   - E-posta, SMS ve telefon araması kanalları için ayrı onay kutucukları sunulması (veya kullanıcının tercih ettiği kanalı seçebilmesi) en iyi uygulama standardıdır.
4. **İleti Yönetim Sistemi (İYS) Entegrasyonu:**
   - Ticari elektronik ileti göndermek isteyen hizmet sağlayıcıların **İYS (`https://iys.org.tr`)** kaydı yaptırması ve alınan onayları **3 iş günü içinde** İYS'ye bildirmesi yasal zorunluluktur (`[REQUIRES BUSINESS INPUT: Şirketin İYS numarası ve entegrasyon durumu]`).
   - Alıcıların İYS üzerinden veya ileti içindeki ücretsiz ret bağlantısı üzerinden verdiği ret bildirimleri **3 iş günü içinde** uygulanmalıdır.

---

## 3. Hazır Onay Metni ve Checkbox Taslakları

İleride bülten veya kampanya formu eklendiğinde kullanılacak onay kutusu metinleri:

### A. Pazarlama Amaçlı Kişisel Veri İşleme ve Ticari Elektronik İleti Onay Kutucuğu (TR)
> `[ ]` **`[REQUIRES BUSINESS INPUT: Resmi Şirket Unvanı]`** (“TAAM Club”) tarafından sunulan ürün ve hizmetlere ilişkin kampanya, indirim, yeni menü duyuruları, etkinlik ve kutlama içerikli **ticari elektronik iletilerin** tarafıma gönderilmesini ve iletişim verilerimin bu amaçla işlenerek İleti Yönetim Sistemi’ne (İYS) kaydedilmesini **kabul ediyorum.**  
>   `[ ] E-posta ile haberdar olmak istiyorum.`  
>   `[ ] SMS ile haberdar olmak istiyorum.`

### B. Marketing & Commercial Electronic Communication Consent Checkbox (EN)
> `[ ]` I hereby give my explicit consent to **`[REQUIRES BUSINESS INPUT: Official Legal Entity Name]`** (“TAAM Club”) to process my contact information for marketing purposes and to send me **commercial electronic communications** regarding promotions, discounts, new menu launches, and events via the selected channels:  
>   `[ ] Email`  
>   `[ ] SMS`

---

## 4. Onay Kaydı (Audit Log) Veritabanı Şeması

İleride ticari elektronik ileti onayı toplanması halinde ispat yükümlülüğünü yerine getirmek için Supabase veritabanına eklenecek tablo şeması:

```sql
CREATE TABLE IF NOT EXISTS marketing_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  channel_email BOOLEAN NOT NULL DEFAULT false,
  channel_sms BOOLEAN NOT NULL DEFAULT false,
  channel_call BOOLEAN NOT NULL DEFAULT false,
  consent_status TEXT NOT NULL CHECK (consent_status IN ('OPT_IN', 'OPT_OUT')),
  consent_source TEXT NOT NULL DEFAULT 'WEB_FORM',
  consent_text_version TEXT NOT NULL DEFAULT 'v1.0',
  ip_address TEXT,
  user_agent TEXT,
  iys_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  withdrawn_at TIMESTAMPTZ
);

ALTER TABLE marketing_consents ENABLE ROW LEVEL SECURITY;
```
