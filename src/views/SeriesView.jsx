import React, { useState, useMemo } from 'react';
import { 
  ListMusic, 
  Search, 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Share2, 
  Music, 
  Clock,
  Loader2,
  X 
} from 'lucide-react';
import HighlightText from '../components/HighlightText';

export default function SeriesView({ 
  seriesList = [], 
  asatidzahList = [],
  onPlayTrack, 
  onShareItem 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUstadz, setSelectedUstadz] = useState('Semua');
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

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
          ustadz: selectedUstadz,
          page: page,
          limit: pageSize
        });
        const res = await fetch(`/api/series?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 0);
        }
      } catch (err) {
        console.error("Failed to fetch series catalog", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Debounce the fetch slightly if typing in search query
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedUstadz, page, pageSize]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedUstadz]);

  const toggleExpandSeries = (seriesId) => {
    setExpandedSeriesId(prev => (prev === seriesId ? null : seriesId));
  };

  const handleCopyLink = (ep) => {
    const link = ep.link || (ep.msg_id ? `https://t.me/daftarkajiansalafy/${ep.msg_id}` : '');
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(ep.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDuration = (secs) => {
    if (!secs || isNaN(secs) || secs <= 0) return '-';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Card */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <ListMusic className="w-5 h-5 text-emerald-600" />
              <span>Seri & Playlist Kajian Rutin</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Koleksi {total ? total.toLocaleString('id-ID') : '449'} seri kajian bersambung yang dikelompokkan per kitab dan pembahasan
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama seri, judul kajian, ustadz..."
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

        {/* Ustadz Filter Dropdown */}
        <div className="max-w-md">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1 mb-1">
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
            <option value="Semua">Semua Pemateri ({total} Seri)</option>
            {asatidzahList.map((u, idx) => (
              <option key={idx} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Series Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3 glass-panel rounded-3xl flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="font-semibold text-sm">Memuat playlist & seri kajian...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 space-y-2 glass-panel rounded-3xl">
          <ListMusic className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada seri yang sesuai pencarian.</p>
          <p className="text-[11px]">Coba cari dengan kata kunci lain atau pilih Semua Pemateri.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((s) => {
            const isExpanded = expandedSeriesId === s.id;

            return (
              <div
                key={s.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 space-y-3 shadow-sm transition-all"
              >
                {/* Series Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                        {s.total_episodes} Episode
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        {s.category}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      <HighlightText text={s.name} highlight={searchQuery} />
                    </h3>

                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <span>🎙️</span>
                      <span><HighlightText text={s.ustadz} highlight={searchQuery} /></span>
                    </p>
                  </div>

                  {/* Expand / Collapse Button */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onShareItem(s)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-press"
                      title="Bagikan Seri"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleExpandSeries(s.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center space-x-1.5 btn-press"
                    >
                      <span>{isExpanded ? 'Tutup Playlist' : `Buka Playlist (${s.total_episodes} Audio)`}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Episodes List */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                    {s.episodes.map((ep, eIdx) => (
                      <div
                        key={ep.id || eIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                            {ep.ep || (eIdx + 1)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs" title={ep.title}>
                              {ep.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {ep.duration > 0 ? `⏱️ ${formatDuration(ep.duration)} • ` : ''}#{ep.msg_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <a
                            href={ep.link || `https://t.me/daftarkajiansalafy/${ep.msg_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center space-x-1 shadow-sm btn-press"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="text-[11px]">Buka di Telegram</span>
                          </a>

                          <button
                            onClick={() => handleCopyLink(ep)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 btn-press"
                            title="Salin Link Telegram"
                          >
                            {copiedId === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
  );
}
