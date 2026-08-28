import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Library,
  Search, 
  User, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  FileCheck, 
  FolderOpen, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  Share2, 
  Users, 
  ArrowLeft, 
  GraduationCap,
  Loader2,
  X 
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
  'Bahasa Arab',
  'Sirah',
  'Al-Qur\'an'
];

const getCoverTheme = (category) => {
  switch (category) {
    case 'Akidah':
      return {
        bg: 'from-indigo-950 via-slate-950 to-indigo-900',
        border: 'border-indigo-500/40',
        accent: 'text-indigo-300',
        badgeBg: 'bg-indigo-900/80 text-indigo-200 border-indigo-700'
      };
    case 'Fiqh':
      return {
        bg: 'from-emerald-950 via-slate-950 to-teal-900',
        border: 'border-emerald-500/40',
        accent: 'text-emerald-300',
        badgeBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
      };
    case 'Hadits':
      return {
        bg: 'from-rose-950 via-slate-950 to-red-900',
        border: 'border-rose-500/40',
        accent: 'text-rose-300',
        badgeBg: 'bg-rose-900/80 text-rose-200 border-rose-700'
      };
    case 'Tafsir':
      return {
        bg: 'from-purple-950 via-slate-950 to-violet-900',
        border: 'border-purple-500/40',
        accent: 'text-purple-300',
        badgeBg: 'bg-purple-900/80 text-purple-200 border-purple-700'
      };
    case 'Adab & Akhlak':
      return {
        bg: 'from-sky-950 via-slate-950 to-cyan-900',
        border: 'border-sky-500/40',
        accent: 'text-sky-300',
        badgeBg: 'bg-sky-900/80 text-sky-200 border-sky-700'
      };
    case 'Manhaj':
      return {
        bg: 'from-orange-950 via-slate-950 to-amber-900',
        border: 'border-orange-500/40',
        accent: 'text-orange-300',
        badgeBg: 'bg-orange-900/80 text-orange-200 border-orange-700'
      };
    case 'Bahasa Arab':
      return {
        bg: 'from-amber-950 via-slate-950 to-amber-900',
        border: 'border-amber-500/40',
        accent: 'text-amber-300',
        badgeBg: 'bg-amber-900/80 text-amber-200 border-amber-700'
      };
    case 'Sirah':
      return {
        bg: 'from-yellow-950 via-slate-950 to-stone-900',
        border: 'border-yellow-600/40',
        accent: 'text-yellow-300',
        badgeBg: 'bg-yellow-900/80 text-yellow-200 border-yellow-700'
      };
    case 'Al-Qur\'an':
      return {
        bg: 'from-teal-950 via-slate-950 to-emerald-900',
        border: 'border-teal-500/40',
        accent: 'text-teal-300',
        badgeBg: 'bg-teal-900/80 text-teal-200 border-teal-700'
      };
    default:
      return {
        bg: 'from-stone-950 via-slate-950 to-neutral-900',
        border: 'border-amber-600/30',
        accent: 'text-amber-300',
        badgeBg: 'bg-stone-900/80 text-stone-200 border-stone-700'
      };
  }
};

export default function LibraryView({ 
  books = [], 
  authors = [], 
  onShareItem, 
  onToggleBookmark, 
  isBookmarked 
}) {
  const [viewMode, setViewMode] = useState('books'); // 'books' or 'authors'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [authorSearch, setAuthorSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedBookIds, setExpandedBookIds] = useState({});

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
          author: selectedAuthor,
          page: page,
          limit: pageSize
        });
        const res = await fetch(`/api/library?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 0);
        }
      } catch (err) {
        console.error("Failed to fetch library catalog", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Debounce the fetch slightly if typing in search query
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedAuthor, page, pageSize]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedAuthor]);

  const filteredAuthors = useMemo(() => {
    if (!authorSearch.trim()) return authors;
    const q = authorSearch.trim().toLowerCase();
    return authors.filter(a => a.name.toLowerCase().includes(q));
  }, [authors, authorSearch]);

  const toggleExpandBook = (bookId) => {
    setExpandedBookIds(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const handleCopyLink = (volume) => {
    if (!volume?.link) return;
    navigator.clipboard.writeText(volume.link);
    setCopiedId(volume.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Card */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Library className="w-5 h-5 text-emerald-600" />
              <span>Perpustakaan Kitab & Dokumen PDF (المكتبة الإسلامية)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Koleksi {total ? total.toLocaleString('id-ID') : '2.300+'} judul kitab rujukan para ulama Ahlussunnah lengkap dengan cover digital dan jumlah halaman
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul kitab, matan, penulis..."
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

        {/* View Mode & Category Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 self-start">
            <button
              onClick={() => setViewMode('books')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 btn-press ${
                viewMode === 'books'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Daftar Kitab</span>
            </button>
            <button
              onClick={() => setViewMode('authors')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 btn-press ${
                viewMode === 'authors'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direktori Penulis ({authors.length})</span>
            </button>
          </div>

          {/* Category Chips */}
          {viewMode === 'books' && (
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
                    className={`px-3 py-1 rounded-xl font-bold shrink-0 btn-press transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODE 1: DIREKTORI PENULIS / MASAYIKH CARDS */}
      {viewMode === 'authors' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Pilih Penulis / Muallif untuk Membuka Seluruh Kitabnya</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Klik salah satu Penulis di bawah untuk melihat daftar karya ilmiah beliau
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama penulis..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredAuthors.map((a, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedAuthor(a.name);
                  setViewMode('books');
                  setPage(1);
                }}
                className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md cursor-pointer space-y-2.5 flex flex-col justify-between btn-press group transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    ✍️
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400" title={a.name}>
                      {a.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {a.books_count} Judul Kitab
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">
                    ~{a.total_pages?.toLocaleString('id-ID')} Hlm
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Buka Kitab</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: MAIN BOOKS GRID WITH 3D COVERS */}
      {viewMode === 'books' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar Authors Directory */}
          <div className="p-4 rounded-2xl glass-panel space-y-3 shadow-sm self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direktori Penulis</span>
              </h3>
              {selectedAuthor !== 'Semua' && (
                <button
                  onClick={() => {
                    setSelectedAuthor('Semua');
                    setPage(1);
                  }}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Author Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari penulis..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            {/* Author List */}
            <div className="space-y-1 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
              <button
                onClick={() => {
                  setSelectedAuthor('Semua');
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between btn-press transition-colors ${
                  selectedAuthor === 'Semua'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <span>Semua Penulis</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedAuthor === 'Semua' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {total}
                </span>
              </button>

              {filteredAuthors.map((a, idx) => {
                const isActive = selectedAuthor === a.name;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAuthor(a.name);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 btn-press transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <span className="truncate" title={a.name}>{a.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {a.books_count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Book Cards Grid */}
          <div className="lg:col-span-3 space-y-4">
            {/* Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl glass-panel text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                {selectedAuthor !== 'Semua' ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAuthor('Semua');
                        setPage(1);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 btn-press"
                      title="Lihat semua penulis"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span>Koleksi Kitab: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">✍️ {selectedAuthor}</strong></span>
                    <span className="text-slate-400">({total} Judul Kitab)</span>
                  </>
                ) : (
                  <span>Menampilkan <strong className="text-slate-900 dark:text-slate-100 font-mono">{total}</strong> judul kitab</span>
                )}
              </div>

              {totalPages > 1 && (
                <span className="font-medium text-slate-500">
                  Halaman {page} dari {totalPages}
                </span>
              )}
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="p-16 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3 glass-panel rounded-3xl flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="font-semibold text-sm">Memuat khazanah kitab & dokumen...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-16 text-center text-xs text-slate-400 space-y-2 glass-panel rounded-3xl">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada kitab yang sesuai.</p>
                <p className="text-[11px]">Coba cari dengan kata kunci lain atau pilih "Semua Penulis".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((book) => {
                  const isExpanded = !!expandedBookIds[book.id];
                  const isMultiVol = book.volumes_count > 1;
                  const theme = getCoverTheme(book.category);
                  const bookmarked = isBookmarked(book);

                  return (
                    <div
                      key={book.id}
                      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-md bg-white dark:bg-slate-900 ${
                        isMultiVol ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Realistic Digital Book Cover Header */}
                      <div className={`relative p-4 sm:p-5 bg-gradient-to-br ${theme.bg} border-b ${theme.border} text-white space-y-3 shadow-inner`}>
                        {/* Left Spine Crease Shadow */}
                        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

                        {/* Top Ribbons */}
                        <div className="flex items-center justify-between gap-2 pl-2">
                          {isMultiVol ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-extrabold text-[10px] flex items-center space-x-1 shadow-sm uppercase tracking-wider">
                              <Layers className="w-3 h-3" />
                              <span>{book.volumes_count} Jilid</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/20 text-[10px] font-semibold flex items-center space-x-1">
                              <FileCheck className="w-3 h-3 text-emerald-400" />
                              <span>1 Jilid PDF</span>
                            </span>
                          )}

                          {/* Page Count */}
                          <span className="px-2 py-0.5 rounded-md bg-black/40 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center space-x-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{book.total_pages ? `${book.total_pages.toLocaleString('id-ID')} Hlm` : '-'}</span>
                          </span>
                        </div>

                        {/* Islamic Ornamental Medallion & Title */}
                        <div className="space-y-2 py-2 pl-2 text-center">
                          <div className="flex items-center justify-center space-x-1 text-amber-400/70 text-xs">
                            <span>❖</span>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-300">{book.category || 'Kitab'}</span>
                            <span>❖</span>
                          </div>

                          <h4 
                            className="text-sm sm:text-base font-bold text-amber-200 leading-snug line-clamp-2 drop-shadow-sm font-serif"
                            dir="auto"
                            title={book.title}
                          >
                            <bdi><HighlightText text={book.title} highlight={searchQuery} /></bdi>
                          </h4>
                        </div>

                        {/* Author Ribbon */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] pl-2">
                          <p className="font-bold text-slate-200 truncate flex items-center space-x-1 max-w-[80%]" title={book.author}>
                            <span className="text-amber-400">✍️</span>
                            <span className="truncate"><HighlightText text={book.author} highlight={searchQuery} /></span>
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {formatSize(book.total_file_size)}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer & Volume Actions */}
                      <div className="p-3.5 space-y-2 bg-slate-50 dark:bg-slate-900/50">
                        {isMultiVol ? (
                          <>
                            <button
                              onClick={() => toggleExpandBook(book.id)}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-between btn-press"
                            >
                              <span className="flex items-center space-x-1.5">
                                <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{isExpanded ? 'Tutup Daftar Jilid' : `Buka Koleksi (${book.volumes_count} Jilid)`}</span>
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Expanded Volume Items List */}
                            {isExpanded && (
                              <div className="space-y-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800 max-h-52 overflow-y-auto no-scrollbar">
                                {book.volumes.map((vol) => (
                                  <div
                                    key={vol.id}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px]" title={vol.title}>
                                        {vol.vol_label}: {vol.title}
                                      </p>
                                      <p className="text-[10px] text-slate-500 font-mono">
                                        {vol.pages ? `${vol.pages} Hlm • ` : ''}{formatSize(vol.size)}
                                      </p>
                                    </div>

                                    <div className="flex items-center space-x-1 shrink-0">
                                      <button
                                        onClick={() => handleCopyLink(vol)}
                                        title="Salin Link Telegram"
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 btn-press"
                                      >
                                        {copiedId === vol.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      </button>
                                      {vol.link && (
                                        <a
                                          href={vol.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="Buka File PDF di Telegram"
                                          className="p-1.5 rounded-lg text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950 btn-press"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          /* Single Volume Direct Actions */
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => onToggleBookmark({ ...book, type: 'book' })}
                                className={`p-1.5 rounded-lg btn-press transition-colors ${
                                  bookmarked
                                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80'
                                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                                title="Simpan Kitab"
                              >
                                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-600' : ''}`} />
                              </button>

                              <button
                                onClick={() => onShareItem({ ...book, type: 'book' })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 btn-press"
                                title="Bagikan Kitab"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>

                            {book.volumes[0]?.link && (
                              <a
                                href={book.volumes[0].link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow-sm btn-press"
                              >
                                <span>Buka PDF</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
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
        </div>
      )}
    </div>
  );
}
