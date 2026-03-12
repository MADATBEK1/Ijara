# 🏠 IjaraGo — O'zbekiston Ijara Platformasi

> O'zbekistondagi eng qulay ijara platformasi. Uy, mashina, texnika va boshqa buyumlarni ijaraga bering yoki oling.

---

## 📁 Fayl Tuzilmasi

```
LOYIHA/
├── index.html              # Bosh sahifa
├── listings.html           # Barcha e'lonlar
├── listing-detail.html     # E'lon batafsil
├── categories.html         # Kategoriyalar
├── how-it-works.html       # Qanday ishlaydi
├── faq.html                # Savol-javoblar
├── contact.html            # Aloqa
├── login.html              # Kirish
├── register.html           # Ro'yxatdan o'tish
├── user-panel.html         # Foydalanuvchi paneli
├── owner-panel.html        # Ega paneli
├── add-listing.html        # E'lon qo'shish
├── admin.html              # Admin panel
├── admin-login.html        # Admin kirish
├── booking.html            # Bron qilish
├── chat.html               # Chat
├── compare.html            # Taqqoslash
├── privacy.html            # Maxfiylik siyosati
├── terms.html              # Foydalanish shartlari
├── 404.html                # Xato sahifasi
├── offline.html            # Offline sahifasi
│
├── style.css               # Asosiy CSS
├── enhancements.css        # Qo'shimcha CSS
│
├── main.js                 # Asosiy JS
├── data.js                 # Ma'lumotlar bazasi
├── auth.js                 # Autentifikatsiya
├── enhancements.js         # Qo'shimcha funksiyalar
├── widgets.js              # Vidjetlar
├── listings-store.js       # E'lonlar saqlash
├── support-chat.js         # Qo'llab-quvvatlash chat
│
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots
├── .htaccess               # Apache server sozlamalari
├── _redirects              # Netlify sozlamalari
└── vercel.json             # Vercel sozlamalari
```

---

## 🚀 Saytga Joylash (Deployment)

### 1️⃣ Netlify (Tavsiya etiladi — Bepul)

1. [netlify.com](https://netlify.com) ga kiring
2. "Add new site" → "Deploy manually" tugmasini bosing
3. `LOYIHA` papkasini butun holda sudrab tashlang (drag & drop)
4. Tayyor! Netlify avtomatik URL beradi
5. **Domain sozlash**: "Domain settings" → Custom domain → `ijarego.uz` qo'shing

### 2️⃣ Vercel (Tez va Bepul)

```bash
# Vercel CLI orqali
npm i -g vercel
cd LOYIHA
vercel --prod
```

Yoki:
1. [vercel.com](https://vercel.com) → "New Project"
2. GitHub reponi ulang yoki papkani yuklang
3. `vercel.json` fayli avtomatik qabul qilinadi

### 3️⃣ GitHub Pages (Bepul)

1. GitHub'da yangi repo yarating: `ijarego-web`
2. Barcha fayllarni yuklang
3. **Settings** → **Pages** → **Branch: main** → **/ (root)**
4. `https://username.github.io/ijarego-web/` manzilida ochiladi

### 4️⃣ Apache/cPanel Hosting

1. cPanel → **File Manager** → `public_html` papkasiga kiring
2. Barcha fayllarni yuklang (`.htaccess` ham!)
3. Domain DNS sozlamalarini hosting IP manziliga yo'naltiring
4. SSL sertifikat: cPanel → **Let's Encrypt** → bepul SSL o'rnatish

---

## 🌐 Domain Sozlash

**DNS Yozuvlari** (domain registratoringizda):
```
Type  Name    Value
A     @       [Hosting IP manzili]
A     www     [Hosting IP manzili]
CNAME www     ijarego.uz
```

---

## ✅ Sayt Ochilishidan Oldin Tekshiring

### Majburiy:
- [ ] Barcha sahifalar ochiladi (404 xatosi yo'q)
- [ ] Mobil ko'rinish yaxshi
- [ ] Rasmlar yuklanadi
- [ ] Login/Register ishlaydi
- [ ] Dark mode ishlaydi
- [ ] Search (qidiruv) ishlaydi

### SEO:
- [ ] `sitemap.xml` saytga qo'shilgan
- [ ] `robots.txt` to'g'ri sozlangan
- [ ] Google Search Console'ga `sitemap.xml` yuborilgan:
  `https://search.google.com/search-console`
- [ ] Meta teglar to'liq

### Performance:
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) da tekshirildi
- [ ] Rasmlar optimallashtirilgan (WebP formatida)

---

## 👤 Demo Hisoblar

| Rol | Email | Parol |
|-----|-------|-------|
| **Foydalanuvchi** | `user@test.com` | `test123` |
| **Ega** | `owner@test.com` | `test123` |
| **Admin** | `admin@ijarego.uz` | `admin2026` |

> ⚠️ Ishlab chiqarish (production) da bu parollarni o'zgartiring!

---

## 🔧 Sozlamalar

### `sitemap.xml` ni yangilash
Yangi sahifa qo'shsangiz, `sitemap.xml` ga yozing:
```xml
<url>
  <loc>https://ijarego.uz/yangi-sahifa.html</loc>
  <lastmod>2026-03-12</lastmod>
  <priority>0.7</priority>
</url>
```

### `manifest.json` — PWA ikonkalari
PWA to'liq ishlashi uchun ikon fayllar kerak:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

---

## 📊 Analytics Qo'shish

Google Analytics uchun `index.html` `</body>` dan oldin qo'shing:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

---

## 📞 Yordam

- **Email**: info@ijarego.uz
- **Telegram**: @ijarego_uz
- **Tel**: +998 71 234 56 78

---

**© 2026 IjaraGo** — Barcha huquqlar himoyalangan.
