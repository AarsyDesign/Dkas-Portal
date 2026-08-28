import React from 'react';
import { X, Sparkles, BookOpen, Search, CheckCircle2, History, Layers } from 'lucide-react';

export default function PatchNotesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const patches = [
    {
      version: 'v2.0.0',
      date: '29 Agustus 2026',
      title: 'Major Production Release: Khutbah Bilingual Reader, Multivolume Library & Unified Series',
      isLatest: true,
      highlights: [
        {
          icon: BookOpen,
          title: 'Khazanah Naskah Khutbah Jum\'at & Mode Mimbar',
          desc: '30 Naskah Khutbah Jum\'at pilihan lengkap dengan 781 paragraf terjemahan dwibahasa (Arab ⇄ Indonesia), pembagian Khutbah 1 & 2, pembesar font mimbar, serta fitur salin dan cetak naskah.'
        },
        {
          icon: Layers,
          title: 'Konsolidasi Perpustakaan Multivolume & Mu\'jam Ulama',
          desc: '1.403 Buku Induk Ulama Salaf dengan pengelompokan jilid interaktif (2.843 PDF) dan 75 Ulama Salaf terverifikasi.'
        },
        {
          icon: Sparkles,
          title: 'Presisi Seri Playlist & Dynamic Hero Search',
          desc: 'Pembersihan 4.596 rekaman playlist (Murattal, Kitab Salaf, Kajian Asatidzah), restrukturisasi Topik Media Dakwah serta bilah pencarian beranimasi dinamis.'
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
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>Catatan Pembaruan Portal</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                  {patches[0]?.version || 'v2.0.0'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Riwayat fitur baru dan peningkatan sistem DKAS Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors btn-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patch List */}
        <div className="space-y-6">
          {patches.map((patch) => (
            <div 
              key={patch.version}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                patch.isLatest 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm' 
                  : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    {patch.version}
                  </span>
                  {patch.isLatest && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      Terbaru
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {patch.date}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {patch.title}
              </h4>

              <div className="space-y-2.5">
                {patch.highlights.map((h, idx) => {
                  const Icon = h.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <div className="p-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {h.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {h.desc}
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
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs btn-press shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
