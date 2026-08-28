# Daftar Kajian Salafy Portal - Patch Notes & Changelog

Catatan rilis dan pembaruan fitur untuk portal publik digital **Daftar Kajian Salafy (DKAS Portal)**.

---

## 🚀 [v2.0.0] - 2026-08-29 : Major Production Release - Khutbah Bilingual Reader, Multivolume Library & Unified Series

### ✨ Fitur Baru & Peningkatan Utama:
- **📜 Khazanah Naskah Khutbah Jum'at & Mode Mimbar**:
  - 30 naskah Khutbah Jum'at pilihan lengkap dari arsip Telegram Topik 46425.
  - 781 paragraf teks Arab berharakat lengkap dengan terjemahan Bahasa Indonesia kalimat-demi-kalimat (*full continuous translation*).
  - 3 Mode Tampilan: *Sejajar (Bilingual)*, *Teks Arab Saja*, dan *Terjemahan Lengkap*.
  - Mode Mimbar dengan zoom ukuran font Arab fleksibel (18px - 36px), navigasi cepat Khutbah 1 & 2, tombol Salin Clipboard, dan Cetak Naskah (*Print ready*).
- **📚 Mu'jam Al-Kutub & Perpustakaan Multivolume Ulama Salaf**:
  - Konsolidasi 1.403 Buku Induk Ulama Salaf dari 2.843 berkas PDF multivolume.
  - Normalisasi 75 Pengarang Ulama Salaf klasik & kontemporer dengan tipografi Arab yang telah dibersihkan.
- **🎙️ Presisi Seri Playlist & Restrukturisasi Media Dakwah**:
  - Rekonsiliasi 4.596 rekaman playlist (Murattal 60 Qari, Audiobook Matan Kitab Ulama Salaf, dan Cerita Anak At-Tuqa).
  - Penataan rapi Topik Media Dakwah (2158) dan Ruang Literasi (42122).
- **🌟 Animated Dynamic Hero Search Bar**:
  - Bilah pencarian dinamis dengan efek ketik otomatis (*typewriter*) yang memutar saran pencarian pemateri, kitab, topik fiqh, akidah, dan khutbah secara interaktif.
- **⚡ Supercharged Lightweight Performance**:
  - Total ukuran muat awal (*initial bundle*) hanya ~76 kB gzipped.
  - PWA Offline-ready dengan Service Worker caching.

---

## 🚀 [v1.2.0] - 2026-08-26 : Smart Syar'i Search Engine & Salaf Digital Library

### ✨ Fitur Baru & Peningkatan:
- **🔍 Smart Islamic Fuzzy & Phonetic Search**:
  - Mesin pencari cerdas yang mendukung variasi ejaan dan toleransi saltik istilah syar'i (`hadits` / `hadist` / `hadis`, `ustadz` / `ustad`, `fiqh` / `fiqih` / `fikih`, `sholat` / `shalat` / `solat`, dll.).
  - Pencarian konsep lintas bahasa Indonesia ↔ Arab (contoh: cari *"puasa"* memunculkan kajian *"shiyam / صيام"*, cari *"jenggot"* memunculkan *"lihyah / لحية"*, cari *"riba"* memunculkan *"ar-riba / الربا"*).
  - Terintegrasi langsung pada API Katalog Audio, Seri Kajian, dan Perpustakaan Kitab.
- **📚 Perpustakaan Kitab Salaf Terstruktur**:
  - Direktori 2.340 judul kitab para ulama Ahlussunnah dengan pengelompokan 2.843 jilid bersambung dalam satu kartu buku.
  - Pembagian 67 pengarang/ulama Salaf klasik dan kontemporer (Syaikhul Islam Ibnu Taimiyyah, Syaikh Ibnu Utsaimin, Syaikh Bin Baz, Imam Ibnu Qayyim, Al-Hafizh Ibnu Hajar, Imam Ibnu Katsir, Imam An-Nawawi, Syaikh Al-Albani, Syaikh As-Sa'di, Syaikh Al-Fauzan, dll.).
  - Indikator badge kategori syar'i, perkiraan halaman, dan tautan unduh dokumen Telegram.
- **🎙️ Seri Kajian & Playlist**:
  - 449 seri kajian tematik dan bedah kitab terstruktur dengan urutan episode otomatis.
- **⚡ PWA & Performa**:
  - Progressive Web App (PWA) dapat di-install di Android, iOS, dan Desktop.
  - Dark Mode & Light Mode dengan palet warna bernuansa Islami modern.
  - Penyimpanan bookmark kajian dan kitab secara lokal (*Offline-first*).

---

## 🚀 [v1.1.0] - 2026-08-24 : Antarmuka Modern & Katalog Audio Terpadu
- Tampilan responsif Glassmorphism untuk mobile dan desktop.
- 32.494 rekaman audio kajian dengan filter asatidzah, kategori syar'i, dan pencarian cepat.
- Fitur salin tautan Telegram, bagikan kajian, dan bookmark favorit.
- Integrasi Cloudflare Pages Functions & D1 SQLite Database.

---

## 🚀 [v1.0.0] - Inisialisasi DKAS Portal
- Peluncuran portal arsip digital kajian ilmiah Ahlussunnah wal Jama'ah.
