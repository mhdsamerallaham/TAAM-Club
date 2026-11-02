# ÖN BİLGİLENDİRME FORMU VE MESAFELİ SATIŞ DEĞERLENDİRMESİ (PRE-INFORMATION FORM)

**Son Güncelleme:** 2026-11-02  
**Yasal Dayanak:** 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği

---

## 1. Mevcut Proje Uygulanabilirlik Değerlendirmesi (Teknik Tespit)

`taam-club` kod tabanı (`src/pages/MenuPage.tsx`, `src/App.tsx`, `package.json`) incelendiğinde:
- **Mevcut Durum:** Web sitesi yalnızca **dijital menü ve fiyat gösterimi (`MenuPage.tsx`)** yapmakta olup, site üzerinden **çevrim içi sipariş alma, sepete ekleme, uzaktan ödeme tahsilatı veya mesafeli satış sözleşmesi kurma özelliği BULUNMAMAKTADIR.**
- Restoran hizmeti fiziksel mekânda oturum (*Dine-in*) ve gel-al (*Takeaway*) şeklinde yürütülmektedir (`src/pages/ContactPage.tsx:238`).
- **Hukuki Sonuç:** Mevcut sürümde site üzerinden mesafeli sözleşme kurulmadığından, ziyaretçilere *Mesafeli Satış Sözleşmesi* veya *Ön Bilgilendirme Formu* onaylatılması gerekmemektedir. Menü sayfasındaki fiyatların **KDV dahil Türk Lirası (`₺`)** cinsinden açıkça gösterilmesi (Fiyat Etiketi Yönetmeliği) yeterlidir ve bu husus `src/pages/MenuPage.tsx:347` satırında (*"Fiyatlarımıza KDV dahildir"*) uygulanmıştır.

---

## 2. Gelecekte Online Sipariş / Paket Servis Özelliği Eklenmesi Halinde Kullanılacak Ön Bilgilendirme Formu Taslağı

İleride web sitesine doğrudan çevrim içi yemek siparişi ve ödeme adımı (`README.md` Gelecek İyileştirmeler maddesi) eklendiğinde, ödeme adımından hemen önce tüketiciye sunulması gereken **Ön Bilgilendirme Formu** taslağı aşağıdadır:

---

### MESAFELİ SATIŞ ÖN BİLGİLENDİRME FORMU (TASLAK — YALNIZCA ONLINE SİPARİŞ AKTİF OLDUĞUNDA KULLANILIR)

#### 1. SATICI BİLGİLERİ
- **Ticari Unvanı:** `[REQUIRES BUSINESS INPUT: Resmi Şirket Unvanı]`
- **MERSİS Numarası:** `[REQUIRES BUSINESS INPUT: MERSİS No]`
- **Vergi Dairesi ve Numarası:** `[REQUIRES BUSINESS INPUT: Vergi Dairesi / Vergi No]`
- **Açık Adresi:** `[REQUIRES BUSINESS INPUT: Tam Açık Restoran/Merkez Adresi, İstanbul]`
- **E-Posta Adresi:** `info@taamclub.com`
- **KEP Adresi:** `[REQUIRES BUSINESS INPUT: KEP Adresi]`

#### 2. SÖZLEŞME KONUSU ÜRÜN / HİZMET VE FİYAT BİLGİLERİ
- Sipariş konusu yiyecek ve içecek ürünlerinin cinsi, porsiyon/gramaj bilgisi, adedi, KDV dahil birim fiyatı ve toplam satış bedeli sipariş özeti ekranında belirtildiği gibidir.
- **Teslimat / Paket Servis Ücreti:** `[REQUIRES BUSINESS INPUT: Teslimat ücreti veya ücretsiz teslimat alt limiti]`
- **Ödeme Yöntemi:** `[REQUIRES BUSINESS INPUT: Kredi/Banka Kartı, Kapıda Ödeme, Yemek Kartları vb.]`

#### 3. TESLİMAT VE İFA KOŞULLARI
- Sipariş edilen ürünler, siparişin onaylanmasını takiben hazırlık süresine bağlı olarak ortalama **`[REQUIRES BUSINESS INPUT: Örn. 30–45 dakika]`** içerisinde Alıcı’nın belirttiği teslimat adresine veya Gel-Al noktasında Alıcı’ya teslim edilir.

#### 4. CAYMA HAKKI VE İSTİSNASI (ÖNEMLİ)
- **Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-c Uyarınca Cayma Hakkı İstisnası:**  
  *"Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmelerde"* tüketici **cayma hakkını kullanamaz.**
- Hazırlanan sıcak yemek, burger, pizza, kızartma, tatlı ve içecek ürünleri çabuk bozulabilen gıda maddesi niteliğinde olduğundan, sipariş mutfakta hazırlanmaya başlandıktan veya teslim edildikten sonra keyfi cayma hakkı kapsamı dışındadır.
- **Kusurlu / Eksik Ürün Durumu:** Teslim edilen ürünün sipariş edilenden farklı, eksik, soğuk veya ayıplı olması halinde 6502 sayılı Kanun kapsamındaki değişim veya bedel iadesi haklarınız saklıdır.

#### 5. ŞİKÂYET VE İTİRAZ MERCİLERİ
- Siparişinizle ilgili her türlü talep ve şikâyetinizi `info@taamclub.com` e-posta adresine iletebilirsiniz.
- Uyuşmazlık halinde Ticaret Bakanlığınca her yıl ilan edilen parasal대 sınırlar dâhilinde Alıcı’nın yerleşim yerindeki veya işlemin yapıldığı yerdeki **Tüketici Hakem Heyetleri** ile **Tüketici Mahkemeleri** yetkilidir.

---

## 3. Hukuki Belgeler Uygulanabilirlik Matrisi (Legal Applicability Matrix)

| Hukuki Belge / Mekanizma | Mevcut Sürümde Zorunlu mu? | Gelecekte Online Sipariş / Analitik Eklenirse Zorunlu mu? | Mevcut Durum |
|---|---|---|---|
| **KVKK Genel Aydınlatma Metni** | **EVET** | **EVET** | Taslağı `docs/KVKK_AYDINLATMA_METNI.md` içinde hazırlandı; `[REQUIRES BUSINESS INPUT]` alanları doldurulup sitede yayınlanmalı. |
| **Çalışan Adayı Aydınlatma Metni (`/careers`)** | **EVET** | **EVET** | Taslağı `docs/KVKK_AYDINLATMA_METNI.md` içinde hazırlandı; `/careers` formuna onay kutucuğu eklendi (`src/pages/CareerPage.tsx:422-436`). |
| **Çerez Politikası ve Çerez Onay Bandı** | **EVET (Kısmi)** | **EVET** | Uygulama birinci taraf takip çerezi kullanmaz ancak `/contact` sayfasında Google Maps iframe'i vardır. Çerez/Harita bilgilendirmesi eklenmelidir. |
| **Veri İşleyen Sözleşmeleri (DPA)** | **EVET** | **EVET** | Vercel, Supabase ve e-posta sağlayıcısı ile standart DPA şartları onaylanmalıdır. |
| **Ticari Elektronik İleti Onayı (İYS)** | **HAYIR** (Bülten/Pazarlama yok) | **EVET** (Kampanya bülteni eklenirse) | `docs/COMMERCIAL_COMMUNICATION_CONSENT.md` içinde şablon hazırlandı. |
| **Ön Bilgilendirme Formu** | **HAYIR** (Online satış yok) | **EVET** (Online sipariş eklenirse) | Bu belgede taslağı hazırlandı. |
| **Mesafeli Satış Sözleşmesi** | **HAYIR** (Online satış yok) | **EVET** (Online sipariş eklenirse) | Online sipariş modülü devreye alınırken eklenecek. |
| **İptal ve İade Politikası** | **HAYIR** (Online ödeme yok) | **EVET** (Online ödeme eklenirse) | Online ödeme entegrasyonu sırasında eklenecek. |
