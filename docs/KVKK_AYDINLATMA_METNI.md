# KVKK AYDINLATMA METNİ VE ÇALIŞAN ADAYI AYDINLATMA METNİ

> **ÖNEMLİ UYARI:** Bu belge, `taam-club` projesinin gerçek teknik işleyişine (web sitesi ziyareti, üçüncü taraf bileşenler ve `/careers` sayfasındaki iş başvuru formu) dayanılarak hazırlanmış taslaktır. Köşeli parantez içinde **`[REQUIRES BUSINESS INPUT]`** olarak işaretlenen ticari unvan, MERSİS, vergi numarası, açık adres ve KEP bilgilerinin canlıya geçiş öncesinde işletme yönetimi ve hukuk müşaviri tarafından doldurulması zorunludur.

---

## 1. Mevcut Sistemde Kişisel Veri İşleme Envanteri (Teknik Tespit)

Kod tabanı incelemesinde tespit edilen kişisel veri işleme noktaları şunlardır:

| Veri Kategorisi | Toplanan Veriler | Toplama Yöntemi / Kaynak Dosya | Hukuki Sebep (KVKK m.5) | Aktarım Yapılan Taraflar |
|---|---|---|---|---|
| **Ziyaretçi Teknik Verileri** | IP adresi, tarayıcı/cihaz bilgisi (User-Agent), ziyaret edilen sayfa, zaman damgası | Web sunucusu (Vercel Edge), Google Fonts (`index.html:34-36`), Unsplash CDN, Google Maps (`src/pages/ContactPage.tsx:151`) | m.5/2-f (Meşru menfaat) / Yurt dışı aktarım için m.9 değerlendirmesi | Vercel Inc. (ABD/AB), Google LLC (ABD), Unsplash Inc. |
| **Çalışan Adayı Verileri (`/careers`)** | Ad Soyad (`fullName`), E-posta (`email`), Telefon (`phone`), Başvurulan Pozisyon (`position`), Deneyim Süresi (`experience`), Ön Yazı/Mesaj (`message`) | `/careers` sayfasındaki Hızlı Başvuru Formu (`src/pages/CareerPage.tsx:82-102`) üzerinden `mailto:info@taamclub.com` e-posta gönderimi | m.5/2-c (Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması) ve m.5/2-f (Meşru menfaat) | `info@taamclub.com` e-posta altyapı sağlayıcısı (`[REQUIRES BUSINESS INPUT: E-posta sunucusu yurt içinde mi yurt dışında mı?]`) |
| **Yönetici (Admin) Verileri (`/admin`)** | Yönetici e-posta adresi, şifre özeti (bcrypt), oturum JWT belirteci, IP adresi | Supabase Auth (`src/pages/AdminPage.tsx:39`) | m.5/2-f (Veri sorumlusunun meşru menfaati ve bilgi güvenliği) | Supabase Inc. (`[REQUIRES BUSINESS INPUT: Supabase bölge seçimi]`) |

### Eksik Bilgiler (İşletme Tarafından Tamamlanacak)
1. Veri Sorumlusunun tam ticari unvanı (`[REQUIRES BUSINESS INPUT]`)
2. MERSİS numarası ve Vergi Dairesi / Vergi Numarası (`[REQUIRES BUSINESS INPUT]`)
3. Resmi tebligat adresi / açık restoran adresi (`[REQUIRES BUSINESS INPUT]`)
4. Kayıtlı Elektronik Posta (KEP) adresi (`[REQUIRES BUSINESS INPUT]`)
5. `info@taamclub.com` e-posta hizmetinin barındırıldığı altyapı sağlayıcısı (örn. Google Workspace, Microsoft 365 veya yerli sunucu) (`[REQUIRES BUSINESS INPUT]`)

---

## 2. Web Sitesi Genel KVKK Aydınlatma Metni (Taslak)

### KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) KAPSAMINDA GENEL AYDINLATMA METNİ

**1. Veri Sorumlusunun Kimliği**  
6698 sayılı Kişisel Verilerin Korunması Kanunu (“**KVKK**”) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla **`[REQUIRES BUSINESS INPUT: Resmi Şirket Unvanı, örn: ... Gıda Turizm San. ve Tic. A.Ş. / Ltd. Şti.]`** (“**TAAM Club**” veya “**Şirket**”) tarafından aşağıda açıklanan kapsamda işlenebilecektir.

- **Ticari Unvan:** `[REQUIRES BUSINESS INPUT: Resmi Ticari Unvan]`
- **MERSİS No:** `[REQUIRES BUSINESS INPUT: MERSİS Numarası]`
- **Adres:** `[REQUIRES BUSINESS INPUT: Tam Açık Resmi Adres, İlçe/İstanbul]`
- **E-Posta:** `info@taamclub.com`
- **KEP Adresi:** `[REQUIRES BUSINESS INPUT: KEP Adresi (varsa)]`
- **Web Sitesi:** `https://taamclub.com`

**2. İşlenen Kişisel Verileriniz ve İşleme Amaçları**  
`https://taamclub.com` internet sitemizi ziyaretiniz ve kullanımınız sırasında aşağıdaki kişisel verileriniz işlenmektedir:

- **İşlem Güvenliği ve Ziyaretçi Verileri (IP Adresi, Tarayıcı/Cihaz Bilgileri, Erişim Kayıtları):** İnternet sitesinin güvenli şekilde sunulması, siber güvenlik tedbirlerinin alınması, 5651 sayılı Kanun ve ilgili mevzuat kapsamındaki yükümlülüklerin yerine getirilmesi, harita ve yazı tipi bileşenlerinin görüntülenmesi amaçlarıyla işlenmektedir.
- **İletişim Verileri (Ad-Soyad, E-posta Adresi, İletişim İçeriği):** `info@taamclub.com` adresine doğrudan e-posta göndermeniz halinde talep, öneri ve şikâyetlerinizin yanıtlanması amacıyla işlenmektedir.

**3. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi**  
Kişisel verileriniz; internet sitemizi ziyaret etmeniz sırasında elektronik ortamda otomatik yollarla (HTTP istekleri, sunucu kayıtları, gömülü Google Haritalar bileşeni) veya e-posta göndermeniz halinde yarı otomatik yollarla toplanmaktadır. Bu veriler KVKK’nın 5. maddesinin 2. fıkrasında yer alan:
- *“Kanunlarda açıkça öngörülmesi”* (m.5/2-a),
- *“Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması”* (m.5/2-ç),
- *“İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması”* (m.5/2-f)  
hukuki sebeplerine dayanılarak işlenmektedir.

**4. Kişisel Verilerin Aktarılması**  
Kişisel verileriniz; yasal zorunluluklar kapsamında yetkili kamu kurum ve kuruluşlarına ve internet sitesi barındırma/altyapı hizmetlerinin yürütülmesi amacıyla bulut altyapı sağlayıcılarımıza (Vercel Inc., Supabase Inc.) ve iletişim sayfasındaki konum haritasının gösterimi için Google LLC’ye KVKK’nın 8. ve 9. maddelerine uygun olarak aktarılabilmektedir. *(Not: Yazı tiplerinin yerel sunucuya taşınması ve çerez/harita onay mekanizması için teknik iyileştirme önerileri `docs/FINAL_AUDIT.md` içerisinde belirtilmiştir).*

**5. Kişisel Verilerin Saklanma Süresi**  
Ziyaretçi trafik ve işlem güvenliği kayıtları ilgili mevzuatta öngörülen süreler (en fazla 2 yıl) boyunca; e-posta yoluyla iletilen talep ve yazışmalar ise genel zamanaşımı süreleri (`[REQUIRES BUSINESS INPUT: Saklama ve İmha Politikası Süresi, örn. 3-10 yıl]`) boyunca saklanmakta ve süre sonunda silinmekte, yok edilmekte veya anonim hale getirilmektedir.

**6. İlgili Kişinin KVKK Madde 11 Kapsamındaki Hakları**  
KVKK’nın 11. maddesi uyarınca veri sahipleri;
1. Kişisel veri işlenip işlenmediğini öğrenme,
2. Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,
3. Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
4. Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,
5. Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,
6. KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,
7. (5) ve (6) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
8. İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,
9. Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.

**7. Başvuru Yöntemi (KVKK Madde 13)**  
Yukarıda belirtilen haklarınıza ilişkin taleplerinizi, *Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ* uyarınca yazılı olarak **`[REQUIRES BUSINESS INPUT: Resmi Tebligat Adresi]`** adresine ıslak imzalı dilekçe ile, **`[REQUIRES BUSINESS INPUT: KEP Adresi]`** üzerinden güvenli elektronik imza ile veya sistemimizde kayıtlı e-posta adresinizden **`info@taamclub.com`** adresine e-posta göndererek iletebilirsiniz. Başvurularınız talebin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılacaktır.

---

## 3. Çalışan Adayı KVKK Aydınlatma Metni (`/careers` Sayfası İçin Taslak)

### ÇALIŞAN ADAYI KİŞİSEL VERİLERİNİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ

**Veri Sorumlusu:** `[REQUIRES BUSINESS INPUT: Resmi Ticari Unvan]` (`https://taamclub.com/careers`)

6698 sayılı Kişisel Verilerin Korunması Kanunu (“**KVKK**”) uyarınca, TAAM Club’a yaptığınız iş başvurusu kapsamında paylaştığınız kişisel verileriniz aşağıda açıklanan çerçevede işlenmektedir:

1. **İşlenen Kişisel Veri Kategorileri:**
   - **Kimlik Bilgileri:** Adınız, soyadınız (`fullName`), özgeçmişinizde yer alan kimlik bilgileri.
   - **İletişim Bilgileri:** E-posta adresiniz (`email`), telefon numaranız (`phone`).
   - **Mesleki Deneyim ve Eğitim Bilgileri:** Başvurulan pozisyon (`position`), sektör deneyim süresi (`experience`), ön yazı / mesaj içeriği (`message`) ve doğrudan e-posta ekinde göndereceğiniz özgeçmiş (CV) bilgileri.
2. **Kişisel Verilerin İşlenme Amaçları:**
   - İş başvurunuzun değerlendirilmesi, açık pozisyonlara uygunluğunuzun tespiti,
   - Mülakat ve işe alım süreçlerinin yürütülmesi ve sizinle iletişime geçilmesi,
   - İşe kabul edilmemeniz halinde, açık rızanız veya meşru menfaat çerçevesinde ileride açılacak uygun pozisyonlar için değerlendirilmesi.
3. **Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi:**
   - Verileriniz `https://taamclub.com/careers` adresindeki başvuru formu aracılığıyla kendi e-posta istemciniz üzerinden `info@taamclub.com` adresine gönderdiğiniz e-posta yoluyla toplanmaktadır.
   - Bu veriler KVKK m.5/2-c (*“Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması”*) ve m.5/2-f (*“İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması”*) hukuki sebeplerine dayanılarak işlenmektedir.
   - **Özel Nitelikli Kişisel Veri Uyarısı:** Özgeçmişinizde veya ön yazınızda sağlık bilgisi, dernek/vakıf/sendika üyeliği, ceza mahkûmiyeti gibi özel nitelikli kişisel verilere (KVKK m.6) yer vermemenizi rica ederiz.
4. **Kişisel Verilerin Aktarılması ve Saklama Süresi:**
   - Başvuru verileriniz yalnızca işe alım sürecinde yetkili insan kaynakları ve restoran yöneticileri tarafından görüntülenmekte olup üçüncü kişilerle paylaşılmamaktadır. E-posta altyapı sağlayıcımızın sunucularının yurt dışında bulunması halinde (`[REQUIRES BUSINESS INPUT: E-posta Sağlayıcı Bilgisi]`), e-posta gönderimi KVKK m.9 kapsamında gerçekleştirilir.
   - İş başvurunuz olumsuz sonuçlandığı takdirde kişisel verileriniz başvuru tarihinden itibaren **`[REQUIRES BUSINESS INPUT: Örn: 6 ay veya 1 yıl]`** süreyle saklanmakta ve bu sürenin sonunda periyodik imha döneminde silinmektedir.
5. **Haklarınız ve Başvuru:**
   - KVKK’nın 11. maddesi kapsamındaki tüm haklarınızı `info@taamclub.com` adresine e-posta göndererek veya **`[REQUIRES BUSINESS INPUT: Resmi Tebligat Adresi]`** adresine yazılı başvuruda bulunarak kullanabilirsiniz.
