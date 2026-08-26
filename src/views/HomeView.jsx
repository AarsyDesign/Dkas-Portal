import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Music, 
  BookOpen, 
  Library, 
  ListMusic, 
  Sparkles, 
  Layers, 
  Users, 
  ArrowRight, 
  GraduationCap, 
  Mic, 
  HelpCircle, 
  Scale, 
  Scroll, 
  ShieldCheck, 
  Compass, 
  Send 
} from 'lucide-react';

const POPULAR_PILLS = [
  { label: '🎓 Dauroh Ilmiah', category: 'Dauroh' },
  { label: '🎙️ Khutbah Jum\'at', category: 'Khutbah Jum\'at' },
  { label: '❓ Tanya Jawab', category: 'Tanya Jawab' },
  { label: '🛡️ Akidah Salaf', category: 'Akidah' },
  { label: '⚖️ Fiqh Ibadah', category: 'Fiqh' },
  { label: '📜 Hadits & Sunnah', category: 'Hadits' },
  { label: '📖 Tafsir Al-Qur\'an', category: 'Tafsir' },
  { label: '📚 Kitab Ulama (PDF)', isLibrary: true },
];

export default function HomeView({ 
  stats, 
  onSearch, 
  onSelectCategory, 
  onNavigateTab, 
  searchQuery, 
  setSearchQuery,
  onPlayTrack
}) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const [booksRes, seriesRes] = await Promise.all([
          fetch('/api/library?limit=4'),
          fetch('/api/series?limit=3')
        ]);
        if (booksRes.ok) {
          const b = await booksRes.json();
          setFeaturedBooks(b.items || []);
        }
        if (seriesRes.ok) {
          const s = await seriesRes.json();
          setFeaturedSeries(s.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured items", err);
      }
    }
    fetchFeatured();
  }, []);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigateTab('catalog');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-8">
      {/* Hero Command Center Section */}
      <div className="relative rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pusat Khazanah & Arsip Kajian Salafy</span>
          </div>

          {/* Main Hero Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Daftar Kajian Asatidzah Salafiyah & Perpustakaan Kitab
            </h1>
            <p className="text-xs sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Akses cepat ke <strong>{stats?.total_audio ? stats.total_audio.toLocaleString('id-ID') : '32.000+'} rekaman audio</strong>, <strong>{stats?.total_series || '400+'} seri kajian rutin</strong>, dan <strong>{stats?.total_books ? stats.total_books.toLocaleString('id-ID') : '2.300+'} judul kitab PDF</strong> para ulama Ahlussunnah.
            </p>
          </div>

          {/* Hero Big Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik judul kajian, nama asatidzah, nama kitab ulama..."
              className="w-full h-12 sm:h-14 pl-12 pr-28 text-xs sm:text-sm rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/20 dark:border-emerald-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-slate-900/90 shadow-2xl backdrop-blur-xl font-medium transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 btn-press"
            >
              Cari
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {POPULAR_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (pill.isLibrary) {
                    onNavigateTab('library');
                  } else {
                    onSelectCategory(pill.category);
                    onNavigateTab('catalog');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md btn-press transition-colors"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigateTab('catalog')}
          className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 space-y-2 btn-press"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {stats?.total_audio ? stats.total_audio.toLocaleString('id-ID') : '-'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Audio Rekaman Kajian</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('library')}
          className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all duration-200 space-y-2 btn-press"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {stats?.total_books ? stats.total_books.toLocaleString('id-ID') : '-'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Judul Kitab PDF Ulama</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('series')}
          className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all duration-200 space-y-2 btn-press"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <ListMusic className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {stats?.total_series ? stats.total_series.toLocaleString('id-ID') : '-'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Seri & Playlist Lengkap</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('catalog')}
          className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-all duration-200 space-y-2 btn-press"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {stats?.total_asatidzah ? stats.total_asatidzah.toLocaleString('id-ID') : '-'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Asatidzah & Masyaikh</p>
          </div>
        </div>
      </div>

      {/* Featured Book Showcase Section */}
      {featuredBooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Koleksi Kitab Rujukan Pilihan</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Matan dan syarah kitab para ulama lengkap dengan cover 3D dan halaman
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('library')}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua Kitab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredBooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                onClick={() => onNavigateTab('library')}
                className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer space-y-3 flex flex-col justify-between btn-press shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {book.category}
                    </span>
                    <span className="text-slate-400 font-mono">
                      📖 {book.total_pages} Hlm
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug font-serif" dir="auto">
                    {book.title}
                  </h4>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 truncate">
                  ✍️ {book.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Series Showcase */}
      {featuredSeries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <ListMusic className="w-5 h-5 text-emerald-600" />
                <span>Seri Kajian Rutin Populer</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kajian bersambung tematik dan pembahasan kitab tersusun rapi
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('series')}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua Seri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredSeries.slice(0, 3).map((s) => (
              <div
                key={s.id}
                onClick={() => onNavigateTab('series')}
                className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 cursor-pointer space-y-3 flex flex-col justify-between btn-press shadow-sm"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    {s.total_episodes} Episode
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                    {s.name}
                  </h4>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                  🎙️ {s.ustadz}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
