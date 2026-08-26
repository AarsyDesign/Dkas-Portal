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
  X 
} from 'lucide-react';
import HighlightText from '../components/HighlightText';

export default function SeriesView({ 
  seriesList = [], 
  onPlayTrack, 
  onShareItem 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUstadz, setSelectedUstadz] = useState('Semua');
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // Extract distinct ustadz in series
  const ustadzOptions = useMemo(() => {
    const map = {};
    seriesList.forEach(s => {
      if (s.ustadz && s.ustadz !== 'Asatidzah') {
        map[s.ustadz] = (map[s.ustadz] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [seriesList]);

  // Filter series
  const filteredSeries = useMemo(() => {
    let result = seriesList;

    if (selectedUstadz && selectedUstadz !== 'Semua') {
      result = result.filter(s => s.ustadz && s.ustadz.toLowerCase() === selectedUstadz.toLowerCase());
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.ustadz && s.ustadz.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.episodes && s.episodes.some(ep => ep.title && ep.title.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [seriesList, selectedUstadz, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSeries.length / pageSize));
  const paginatedSeries = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSeries.slice(start, start + pageSize);
  }, [filteredSeries, page, pageSize]);

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
              Koleksi {seriesList.length.toLocaleString('id-ID')} seri kajian bersambung yang dikelompokkan per kitab dan pembahasan
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
        <div className="max-w-xs">
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
            <option value="Semua">Semua Pemateri ({seriesList.length} Seri)</option>
            {ustadzOptions.map((u, idx) => (
              <option key={idx} value={u.name}>{u.name} ({u.count} Seri)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Series Cards Grid */}
      {paginatedSeries.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 space-y-2 glass-panel rounded-3xl">
          <ListMusic className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada seri yang sesuai pencarian.</p>
          <p className="text-[11px]">Coba cari dengan kata kunci lain atau pilih Semua Pemateri.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedSeries.map((s) => {
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
                          <button
                            onClick={() => onPlayTrack({
                              ...ep,
                              t: ep.title,
                              u: s.ustadz,
                              l: ep.link,
                              m: ep.msg_id,
                              d: ep.duration
                            })}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1 shadow-sm btn-press"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span className="text-[11px]">Putar</span>
                          </button>

                          <button
                            onClick={() => handleCopyLink(ep)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 btn-press"
                            title="Salin Link Telegram"
                          >
                            {copiedId === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {ep.link && (
                            <a
                              href={ep.link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950 btn-press"
                              title="Buka di Telegram"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
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
