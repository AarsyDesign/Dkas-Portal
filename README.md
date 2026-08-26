# 🌟 DKAS Portal (Daftar Kajian Salafy - Web Publik)

Portal publik resmi untuk pencarian audio kajian Islam ilmiah Ahlussunnah, seri playlist kajian asatidzah, dan perpustakaan digital kitab rujukan PDF para ulama salaf.

---

## 🚀 Fitur Utama
- ⚡ **Pencarian Super Cepat (<10ms)**: Mencari di antara 32.400+ rekaman audio kajian dan 2.350+ kitab PDF secara instan di sisi klien (browser).
- 🎙️ **Katalog Audio Kajian**: Filter Pemateri / Asatidzah, Kategori (Akidah, Fiqh, Hadits, Tafsir, Dauroh, Khutbah Jum'at, Tanya Jawab).
- 📚 **Perpustakaan Kitab PDF**: Tampilan sampul buku digital 3D (*Digital Hardcover*), Direktori Penulis/Ulama, Jumlah Halaman Asli/Estimasi, dan Bundel Multi-Jilid.
- 📑 **Seri & Playlist Kajian**: 440+ seri kajian bersambung dengan playlist terurut.
- 🎵 **Floating Audio Mini-Player**: Pemutar audio mengambang yang nyaman di mobile dan desktop.
- ⭐ **Favorit & Bookmark Lokal**: Pengguna dapat menyimpan kajian dan kitab di memori browser HP tanpa perlu akun/login.
- 📲 **One-Tap Share**: Tombol bagikan langsung ke WhatsApp & Telegram.
- 📱 **PWA Ready**: Dapat di-install langsung ke layar utama (*Home Screen*) smartphone Android & iOS.

---

## 💻 Menjalankan Secara Lokal
```bash
# Masuk ke direktori
cd dkas-portal

# Jalankan dev server
npm run dev
```
Buka browser di `http://localhost:5173`.

---

## ☁️ Cara Deploy ke Cloudflare Pages & GitHub (Gratis Selamanya)

1. **Buat Repositori Baru di GitHub** (misal: `dkas-portal`).
2. **Inisialisasi & Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit dkas portal"
   git branch -M main
   git remote add origin https://github.com/USERNAME/dkas-portal.git
   git push -u origin main
   ```
3. **Hubungkan ke Cloudflare Pages**:
   - Buka Dashboard [Cloudflare Pages](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Pilih repositori `dkas-portal`.
   - **Framework Preset**: Pilih `Vite`.
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - Klik **Save and Deploy**.
4. **Pasang Domain Kustom**:
   - Di tab **Custom domains**, tambahkan nama domain Anda (misal `daftarkajian.id`).
