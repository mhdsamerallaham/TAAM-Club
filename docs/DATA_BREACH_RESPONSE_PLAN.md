# VERİ İHLALİ MÜDAHALE PLANI (DATA BREACH RESPONSE PLAN)

**Belge Kodu:** TAAM-SEC-IRP-001  
**Yürürlük Tarihi:** 2026-11-02  
**Yasal Dayanak:** 6698 Sayılı KVKK Madde 12/5 ve Kişisel Verileri Koruma Kurulunun 24.01.2019 Tarih ve 2019/10 Sayılı Kararı

---

## 1. Amaç ve Kapsam

Bu plan; **TAAM Club** (`https://taamclub.com`), Supabase veritabanı, Vercel barındırma altyapısı veya kurumsal e-posta sistemi (`info@taamclub.com`) üzerinde işlenen kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi, değiştirilmesi, silinmesi veya yetkisiz erişime maruz kalması durumunda uygulanacak **10 aşamalı müdahale sürecini**, sorumlulukları ve bildirim prosedürlerini tanımlar.

### Sorumlu Roller ve İletişim Tablosu

| Rol | Görev Tanımı | Sorumlu Kişi / İletişim |
|---|---|---|
| **Veri Sorumlusu Temsilcisi / İrtibat Kişisi** | KVKK Kurul bildirimleri, resmi yazışmalar ve üst yönetim kararları | `[REQUIRES BUSINESS INPUT: Ad Soyad / Unvan / Telefon]` |
| **Teknik Müdahale Sorumlusu (Sistem/Yazılım)** | Supabase, Vercel, DNS ve GitHub erişim kontrolü, log analizi, izolasyon | `[REQUIRES BUSINESS INPUT: Ad Soyad / E-posta / Telefon]` |
| **Hukuk Müşaviri / KVKK Danışmanı** | İhlalin bildirim yükümlülüğü doğurup doğurmadığının hukuki değerlendirmesi | `[REQUIRES BUSINESS INPUT: Hukuk Bürosu / Avukat İletişim]` |
| **Kurumsal İletişim Sorumlusu** | İlgili kişilere (veri sahiplerine) yapılacak bildirimlerin koordinasyonu | `info@taamclub.com` / `[REQUIRES BUSINESS INPUT]` |

---

## 2. 10 Aşamalı Veri İhlali Müdahale Süreci

### Aşama 1: Olay Tespiti (Incident Detection) — `[T + 0 Saat]`
Veri ihlali veya güvenlik olayı aşağıdaki kanallardan biriyle tespit edilir:
- Supabase Auth / Postgres loglarında olağandışı oturum açma veya yetkisiz veri değişikliği (`/admin`),
- `info@taamclub.com` e-posta hesabında yetkisiz erişim uyarısı (kariyer başvuruları ve iletişim e-postaları),
- Vercel veya GitHub üzerinde yetkisiz dağıtım (deployment) ya da kod değişikliği,
- Ziyaretçi, çalışan adayı veya üçüncü taraf güvenlik araştırmacısı bildirimi.

**Acil Aksiyon:** Olayı fark eden personel derhal Teknik Müdahale Sorumlusuna ve Veri Sorumlusu Temsilcisine haber verir; olayın tespit edildiği tam saat (`Tespit Zamanı = T0`) kayıt altına alınır.

### Aşama 2: İlk Değerlendirme ve Sınıflandırma (Initial Assessment) — `[T0 + 2 Saat İçinde]`
Teknik Müdahale Sorumlusu olayın niteliğini değerlendirir:
1. Olay bir yanlış alarm mı (false positive), yoksa gerçek bir güvenlik ihlali mi?
2. Olay yalnızca herkese açık menü/kategori verilerini mi etkiledi, yoksa **kişisel verileri** (örn. `info@taamclub.com` e-posta kutusundaki iş başvuruları/özgeçmişler veya `auth.users` tablosundaki yönetici bilgileri) etkiledi mi?
3. Etkilenen veri kategorileri (kimlik, iletişim, özgeçmiş, parola özeti) ve tahmini kişi sayısı nedir?

### Aşama 3: Sınırlandırma ve İzolasyon (Containment) — `[T0 + 4 Saat İçinde]`
İhlalin devam etmesini önlemek için derhal aşağıdaki teknik önlemler uygulanır:
- **Supabase İhlali Durumunda:**
  - Supabase Dashboard → **Settings → API** üzerinden JWT Secret ve `anon` / `service_role` anahtarları yenilenir (rotate edilir).
  - Tüm aktif yönetici oturumları (`auth.sessions`) sonlandırılır ve yönetici parolaları sıfırlanır.
- **E-Posta (`info@taamclub.com`) İhlali Durumunda:**
  - E-posta hesap parolası derhal değiştirilir, tüm aktif oturumlar kapatılır, 2FA/MFA anahtarları yenilenir ve yetkisiz yönlendirme (auto-forwarding) kuralları kontrol edilerek silinir.
- **Vercel / GitHub İhlali Durumunda:**
  - İlgili API token'ları iptal edilir ve son güvenli commit'e (`git revert` / Vercel Instant Rollback) geri dönülür.

### Aşama 4: Teknik İnceleme ve Kök Neden Analizi (Investigation) — `[T0 + 12 Saat İçinde]`
- Saldırı vektörü (oltalama, zayıf parola, RLS yapılandırma hatası, bağımlılık zafiyeti vb.) tespit edilir.
- İhlalin başlangıç tarihi/saati, tespit tarihi/saati ve erişilen kayıtların tam kapsamı belirlenir.

### Aşama 5: Kanıtların Korunması (Evidence Preservation) — `[Sürekli]`
- Hukuki süreçler ve Kurul incelemesi için hiçbir log kaydı silinmez!
- Supabase `auth_audit_entries`, Postgres logları, Vercel erişim logları ve e-posta giriş kayıtları (`IP`, `Timestamp`, `User-Agent`) dışa aktarılarak (`export`) değiştirilemez biçimde (SHA-256 özeti alınarak) güvenli bir ortamda arşivlenir.

### Aşama 6: Kurtarma ve Sistemleri Güvenli Hale Getirme (Recovery) — `[T0 + 24 Saat İçinde]`
- Güvenlik açığı kapatılır, temiz yedeklerden veri geri yüklemesi yapılır.
- Sistemin normal ve güvenli çalışmaya döndüğü doğrulama testleriyle (`npm run lint`, `npm run build`, RLS testleri) teyit edilir.

### Aşama 7: İç Bildirim ve Kayıt (Internal Notification) — `[T0 + 24 Saat İçinde]`
- Teknik ekip bulgularını yazılı **Olay Raporu** halinde Veri Sorumlusu Temsilcisi ve Hukuk Müşavirine sunar.
- Olay, kişisel veri ihlali içermese bile şirket içi *Veri İhlali Kayıt Defteri*'ne işlenir.

### Aşama 8: Kişisel Verileri Koruma Kurulu Bildirim Değerlendirmesi (KVKK Board Notification Assessment) — `[T0 + 24–72 Saat İçinde]`
- **Hukuki Değerlendirme:** KVKK Madde 12/5 uyarınca, işlenen kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi hâlinde veri sorumlusu bu durumu **en kısa sürede** ilgilisine ve Kurula bildirmekle yükümlüdür.
- **72 Saat Kriteri:** Kişisel Verileri Koruma Kurulunun **24.01.2019 tarih ve 2019/10 sayılı Kararı** uyarınca *"en kısa sürede"* ifadesi **72 saat** olarak yorumlanmaktadır.
- **Not:** Her teknik arıza veya kişisel veri içermeyen olay (örneğin yalnızca menü fiyatlarının tutulduğu ve kişisel veri barındırmayan `products` tablosuna yönelik bir kesinti) Kurul bildirimi gerektirmez. Ancak `info@taamclub.com` üzerindeki çalışan adayı özgeçmişlerinin veya kullanıcı kişisel verilerinin yetkisiz kişilerce elde edildiği tespit edilirse, Hukuk Müşaviri değerlendirmesiyle **tespit anından itibaren en geç 72 saat içinde** `https://ihlalbildirimi.kvkk.gov.tr/` üzerinden veya Kurulun Veri İhlali Bildirim Formu ile bildirim yapılır. Haklı bir nedenขle 72 saat içinde bildirim yapılamaması halinde, gecikmenin sebepleri de bildirimle birlikte Kurula açıklanır.

### Aşama 9: İlgili Kişilere (Veri Sahiplerine) Bildirim Değerlendirmesi (Data Subject Notification) — `[Veri Sahipleri Belirlendikten Sonra Makul En Kısa Sürede]`
- Kişisel verileri ihlalden etkilenen kişilerin (örneğin iş başvurusu yapan adayların) tespitini müteakip, ilgili kişilere doğrudan (e-posta veya iletişim kanalları üzerinden); doğrudan ulaşılamıyorsa `https://taamclub.com` ana sayfası üzerinden açık ve sade bir dille bildirim yapılır.
- Bildirimde asgari olarak şu unsurlar yer alır:
  1. İhlalin ne zaman gerçekleştiği,
  2. Kişisel veri kategorileri bazında hangi verilerin etkilendiği,
  3. İhlalin olası sonuçları,
  4. Veri sorumlusunun ihlalin olumsuz etkilerini azaltmak için aldığı veya önerdiği tedbirler,
  5. İlgili kişilerin bilgi alabileceği irtibat noktaları (`info@taamclub.com`).

### Aşama 10: Olay Sonrası Değerlendirme (Post-Incident Review) — `[T0 + 14 Gün İçinde]`
- Olayın tekrarlanmaması için alınacak kalıcı teknik ve idari önlemler belirlenir.
- `docs/DATA_SECURITY_POLICY.md` ve erişim politikaları güncellenir.

