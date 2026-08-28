import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Play, 
  Music, 
  ExternalLink, 
  Share2, 
  Bookmark, 
  Check, 
  Copy, 
  User, 
  Filter, 
  Clock, 
  X,
  Layers,
  ArrowUpDown,
  ArrowDownUp
} from 'lucide-react';
import HighlightText from '../components/HighlightText';

const CATEGORIES = [
  'Semua',
  'Akidah',
  'Fiqh',
  'Hadits',
  'Tafsir',
  'Adab & Akhlak',
  'Manhaj',
  'Sirah',
  'Dauroh',
  'Khutbah Jum\'at',
  'Tanya Jawab',
  'Tematik'
];

const SORT_OPTIONS = [
  { id: 'msg_desc', label: '🔥 Kajian Terbaru (Default)' },
  { id: 'msg_asc', label: '🔢 Nomor Kajian 1 ➔ Seterusnya (Awal / Terlama)' },
  { id: 'title_asc', label: '🔤 Judul A ➔ Z' },
  { id: 'title_desc', label: '🔤 Judul Z ➔ A' },
  { id: 'duration_desc', label: '⏱️ Durasi Terpanjang' },
  { id: 'duration_asc', label: '⏱️ Durasi Terpendek' }
];

export default function CatalogView({ 
  asatidzahList = [], 
  onPlayTrack, 
  onShareItem, 
  onToggleBookmark, 
  isBookmarked,
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'Semua',
  setSelectedCategory,
  selectedUstadz = 'Semua',
  setSelectedUstadz
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [sortBy, setSortBy] = useState('msg_desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from API
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          category: selectedCategory,
          ustadz: selectedUstadz,
          sortBy: sortBy,
          page: page,
          limit: pageSize
        });
        const res = await fetch(`/api/audio?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 0);
        }
      } catch (err) {
        console.error("Failed to fetch audio catalog", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Debounce the fetch slightly if typing in search query
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedUstadz, sortBy, page, pageSize]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedUstadz, sortBy]);

  const handleCopyLink = (item) => {
    const link = item.l || (item.m ? `https://t.me/daftarkajiansalafy/${item.m}` : '');
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(item.i);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDuration = (secs) => {
    if (!secs || isNaN(secs) || secs <= 0) return '-';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Filter Header Box */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Music className="w-5 h-5 text-emerald-600" />
              <span>Katalog Rekaman Audio Kajian</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan {total.toLocaleString('id-ID')} rekaman kajian
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul, ustadz, kitab..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters & Sorting Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Ustadz Select Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-3 h-3 text-emerald-600" />
              <span>Filter Pemateri</span>
            </label>
            <select
              value={selectedUstadz}
              onChange={(e) => {
                setSelectedUstadz(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="Semua">Semua Asatidzah ({asatidzahList.length})</option>
              {asatidzahList.map((u, i) => (
                <option key={i} value={u.name}>{u.name} ({u.count})</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-3 h-3 text-emerald-600" />
              <span>Filter Kategori</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {CATEGORIES.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              <span>Urutkan Hasil</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-medium font-semibold text-emerald-700 dark:text-emerald-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar touch-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 btn-press transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Cards Grid */}
      {items.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 space-y-2 glass-panel rounded-3xl">
          <Music className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada kajian audio yang sesuai pencarian.</p>
          <p className="text-[11px]">Coba ubah kata kunci atau reset filter pemateri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {items.map((item) => {
            const telegramLink = item.l || (item.m ? `https://t.me/daftarkajiansalafy/${item.m}` : '');
            const bookmarked = isBookmarked(item);

            return (
              <div
                key={item.i}
                className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 space-y-3 flex flex-col justify-between shadow-sm transition-all duration-150"
              >
                {/* Header & Badges */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {item.c || 'Tematik'}
                      </span>
                      {item.m && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold">
                          #{item.m}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      {item.d > 0 && <span>⏱️ {formatDuration(item.d)}</span>}
                      {item.s > 0 && <span>• {formatSize(item.s)}</span>}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 
                    className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2"
                    dir="auto"
                    title={item.t}
                  >
                    <HighlightText text={item.t} highlight={searchQuery} />
                  </h4>

                  {/* Ustadz & Kitab */}
                  <div className="space-y-0.5 text-[11px]">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 truncate flex items-center space-x-1">
                      <span>🎙️</span>
                      <span className="truncate"><HighlightText text={item.u} highlight={searchQuery} /></span>
                    </p>
                    {item.k && (
                      <p className="text-slate-500 dark:text-slate-400 truncate text-[10px]">
                        📖 Kitab: {item.k}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-1">
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm btn-press"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Telegram</span>
                  </a>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleBookmark(item)}
                      className={`p-1.5 rounded-lg btn-press transition-colors ${
                        bookmarked
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={bookmarked ? 'Hapus Simpan' : 'Simpan Kajian'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-emerald-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => onShareItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-press"
                      title="Bagikan"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopyLink(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-press"
                      title="Salin Tautan"
                    >
                      {copiedId === item.i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="pt-4 flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 btn-press"
          >
            Sebelumnya
          </button>

          <span className="text-xs text-slate-500 font-medium px-2">
            Halaman {page} dari {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 btn-press"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
