import React from 'react';
import { X, Sparkles, BookOpen, Search, CheckCircle2, History, Layers, Bell, Bookmark } from 'lucide-react';

export default function PatchNotesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const patches = [
    {
      version: 'v2.1.0',
      date: '16 Oktober 2026',
      title: 'Performance Overhaul, Smart Search & Lonceng Notifikasi Web Push',
      isLatest: true,
      highlights: [
        {
          icon: Bell,
          title: 'Saklar Lonceng Notifikasi 1-Klik (ON / OFF)',
          desc: 'Aktifkan atau matikan pemberitahuan kajian langsung dari ikon Lonceng di bilah navigasi atas tanpa perlu login atau nomor HP.'
        },
        {
          icon: Bookmark,
          title: 'Pengingat Harian Kajian & Kitab Tersimpan (Jam 09.00 Pagi)',
          desc: 'Jika Anda menyimpan audio kajian atau kitab di Bookmark, sistem otomatis mengirimkan 1 pengingat lembut setiap pukul 09.00 pagi sesuai judul bacaan/simakan Anda.'
        },
        {
          icon: Sparkles,
          title: 'Muat Khutbah Instan 99.7% Lebih Cepat',
          desc: 'Katalog naskah dipisahkan menjadi 34.5 KB (sebelumnya 10.4 MB) dan pemuatan teks Arab-Indo secara on-demand saat dibuka. Indikator akurat 87 naskah khutbah lengkap.'
        },
        {
          icon: Search,
          title: 'Smart Islamic Matcher di Klien & Cache Worker',
          desc: 'Pencarian sinonim syar\'i & toleransi saltik aktif di sisi browser saat offline. Cloudflare Worker kini menggunakan memory caching instan (<5ms).'
        },
        {
          icon: BookOpen,
          title: 'Hash Deep-Linking, Back Button & Keyboard Shortcuts',
          desc: 'Navigasi URL hash (#catalog, #khutbah, dll) dengan dukungan tombol Back HP tanpa keluar aplikasi, serta shortcut Ctrl+K dan Escape.'
        }
      ]
    },
    {
      version: 'v2.0.0',
      date: '29 Agustus 2026',
      title: 'Major Production Release: Khutbah Bilingual Reader, Multivolume Library & Unified Series',
      isLatest: false,
      highlights: [
        {
          icon: BookOpen,
          title: 'Khazanah Naskah Khutbah Jum\'at & Mode Mimbar',
          desc: 'Naskah Khutbah Jum\'at pilihan lengkap dengan teks terjemahan dwibahasa (Arab ⇄ Indonesia), pembagian Khutbah 1 & 2, pembesar font mimbar, serta fitur salin dan cetak naskah.'
        },
        {
          icon: Layers,
          title: 'Konsolidasi Perpustakaan Multivolume & Mu\'jam Ulama',
          desc: '1.628 Buku Induk Ulama Salaf dengan pengelompokan jilid interaktif dan Ulama Salaf terverifikasi.'
        },
        {
          icon: Sparkles,
          title: 'Presisi Seri Playlist & Dynamic Hero Search',
          desc: 'Pembersihan ribuan rekaman playlist, restrukturisasi Topik Media Dakwah serta bilah pencarian beranimasi dinamis.'
        }
      ]
    },
    {
      version: 'v1.2.0',
      date: '26 Agustus 2026',
      title: 'Smart Syar\'i Search Engine & Salaf Digital Library',
      isLatest: false,
      highlights: [
        {
          icon: Search,
          title: 'Islamic Fuzzy & Phonetic Search Engine',
          desc: 'Mesin pencari fonetik cerdas toleran saltik (hadits/hadist, ustadz/ustad) dan pencarian konsep lintas bahasa Indonesia ↔ Arab.'
        },
        {
          icon: BookOpen,
          title: 'Perpustakaan Kitab Salaf Terstruktur',
          desc: 'Koleksi ribuan kitab para ulama Ahlussunnah lengkap dengan pembagian pengarang ulama Salaf dan pengelompokan jilid otomatis.'
        }
      ]
    },
    {
      version: 'v1.1.0',
      date: '24 Agustus 2026',
      title: 'Antarmuka Modern Glassmorphism & Audio Catalog',
      isLatest: false,
      highlights: [
        {
          icon: CheckCircle2,
          title: 'Katalog 32.494 Rekaman Audio',
          desc: 'Filter interaktif berdasarkan asatidzah dan 10 kategori syar\'i.'
        },
        {
          icon: Sparkles,
          title: 'Bookmark & Dark Mode Support',
          desc: 'Simpan kajian favorit ke penyimpanan lokal dan tema gelap bernuansa Islami.'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Catatan Rilis & Pembaruan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Riwayat evolusi dan peningkatan fitur DKAS Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup Catatan Rilis"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Releases */}
        <div className="space-y-6">
          {patches.map((patch) => (
            <div
              key={patch.version}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                patch.isLatest
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                    {patch.version}
                  </span>
                  {patch.isLatest && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Rilis Terbaru
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {patch.date}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                {patch.title}
              </h4>

              <div className="space-y-2.5">
                {patch.highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs">
                      <div className="p-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-700 dark:text-slate-200">
                          {item.title}
                        </strong>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-all shadow-md active:scale-95"
          >
            Tutup Catatan Rilis
          </button>
        </div>
      </div>
    </div>
  );
}
