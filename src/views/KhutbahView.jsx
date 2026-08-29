import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ScrollText, 
  Search, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Languages, 
  BookOpen, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  ArrowLeft,
  AlignLeft,
  AlignRight
} from 'lucide-react';
import HighlightText from '../components/HighlightText';
import CategoryScrollRow from '../components/CategoryScrollRow';

export default function KhutbahView() {
  const [khutbahList, setKhutbahList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Active Reader Modal State
  const [activeKhutbah, setActiveKhutbah] = useState(null);
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [indoFontSize, setIndoFontSize] = useState(15);
  const [readerTab, setReaderTab] = useState('full'); // 'k1' | 'k2' | 'full'
  const [displayMode, setDisplayMode] = useState('bilingual'); // 'arabic' | 'indo' | 'bilingual'
  const [copySuccess, setCopySuccess] = useState(false);
  
  const readerBodyRef = useRef(null);

  useEffect(() => {
    async function loadKhutbah() {
      try {
        const res = await fetch('/api/khutbah');
        if (res.ok) {
          const data = await res.json();
          setKhutbahList(data.items || data || []);
        } else {
          // Fallback to static JSON file
          const fallbackRes = await fetch('/data/khutbah_texts.json');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            setKhutbahList(fallbackData || []);
          }
        }
      } catch (err) {
        console.error('Failed to load khutbah texts', err);
        try {
          const fallbackRes = await fetch('/data/khutbah_texts.json');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            setKhutbahList(fallbackData || []);
          }
        } catch (e) {
          console.error('Fallback load error:', e);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadKhutbah();
  }, []);

  // Scroll to top whenever tab or active khutbah changes
  useEffect(() => {
    if (readerBodyRef.current) {
      readerBodyRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [readerTab, activeKhutbah]);

  // Filter Categories
  const categories = useMemo(() => {
    const set = new Set(khutbahList.map(k => k.category).filter(Boolean));
    return ['Semua', ...Array.from(set)];
  }, [khutbahList]);

  // Filtered List
  const filteredKhutbah = useMemo(() => {
    return khutbahList.filter(k => {
      const matchCat = selectedCategory === 'Semua' || k.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchQuery = 
        (k.title_ar && k.title_ar.toLowerCase().includes(q)) ||
        (k.title_id && k.title_id.toLowerCase().includes(q)) ||
        (k.summary_id && k.summary_id.toLowerCase().includes(q)) ||
        (k.full_arabic_text && k.full_arabic_text.toLowerCase().includes(q)) ||
        (k.full_indonesian_text && k.full_indonesian_text.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [khutbahList, selectedCategory, searchQuery]);

  // Helper functions for safe extraction
  const getKhutbah1List = (k) => {
    if (!k) return [];
    if (k.khutbah_1 && k.khutbah_1.length > 0) return k.khutbah_1;
    if (k.paragraphs && k.paragraphs.length > 0) {
      const idx = k.paragraphs.findIndex(p => p.arabic && (p.arabic.includes('الخطبة الثانية') || p.arabic.includes('الْخُطْبَةُ الثَّانِيَةُ')));
      if (idx > 0) return k.paragraphs.slice(0, idx);
      return k.paragraphs.slice(0, Math.ceil(k.paragraphs.length / 2));
    }
    return [];
  };

  const getKhutbah2List = (k) => {
    if (!k) return [];
    if (k.khutbah_2 && k.khutbah_2.length > 0) return k.khutbah_2;
    if (k.paragraphs && k.paragraphs.length > 0) {
      const idx = k.paragraphs.findIndex(p => p.arabic && (p.arabic.includes('الخطبة الثانية') || p.arabic.includes('الْخُطْبَةُ الثَّانِيَةُ')));
      if (idx > 0) return k.paragraphs.slice(idx);
      return k.paragraphs.slice(Math.ceil(k.paragraphs.length / 2));
    }
    return [];
  };

  // Get active paragraphs based on tab (full, khutbah 1, or khutbah 2)
  const activeParagraphs = useMemo(() => {
    if (!activeKhutbah) return [];
    if (readerTab === 'k1') return getKhutbah1List(activeKhutbah);
    if (readerTab === 'k2') return getKhutbah2List(activeKhutbah);
    return activeKhutbah.paragraphs || [];
  }, [activeKhutbah, readerTab]);

  const handleOpenReader = (k, tab = 'full') => {
    setActiveKhutbah(k);
    setReaderTab(tab);
  };

  const handleCopy = () => {
    if (!activeKhutbah) return;
    let textToCopy = '';
    
    if (displayMode === 'arabic') {
      textToCopy = activeParagraphs.map(p => p.arabic).join('\n\n');
    } else if (displayMode === 'indo') {
      textToCopy = activeParagraphs.map(p => p.indonesian).join('\n\n');
    } else {
      textToCopy = activeParagraphs.map(p => `${p.arabic}\n\n[Terjemahan]:\n${p.indonesian}`).join('\n\n---\n\n');
    }

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200/80 dark:border-emerald-800/80">
              <ScrollText className="w-3.5 h-3.5" />
              <span>Naskah & Khazanah Khatib</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200/80 dark:border-amber-800/80">
              30 Naskah Khutbah Lengkap & Terjemah
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Teks Naskah Khutbah Jum'at
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Kumpulan naskah khutbah Jum'at tematik pilihan lengkap dengan teks Arab berharakat, <strong>terjemahan lengkap kalimat demi kalimat</strong>, serta mode baca mimbar yang nyaman bagi para asatidzah & khatib.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="pt-2 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tema, judul khutbah, dalil ayat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex-1 max-w-full md:max-w-md">
              <CategoryScrollRow
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                activeColor="bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 ring-1 ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Khutbah Cards */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3 glass-panel rounded-3xl flex flex-col items-center justify-center">
          <ScrollText className="w-8 h-8 animate-pulse text-emerald-600" />
          <p className="font-semibold text-sm">Memuat khazanah naskah khutbah...</p>
        </div>
      ) : filteredKhutbah.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 space-y-2 glass-panel rounded-3xl">
          <ScrollText className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada naskah khutbah yang sesuai.</p>
          <p className="text-[11px]">Coba cari dengan kata kunci lain atau pilih kategori Semua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKhutbah.map((k) => {
            const k1Count = getKhutbah1List(k).length;
            const k2Count = getKhutbah2List(k).length;
            return (
              <div
                key={k.id || k.msg_id}
                className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {k.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{k.paragraphs_count || (k.paragraphs ? k.paragraphs.length : 0)} Paragraf</span>
                    </span>
                  </div>

                  {/* Arabic Title */}
                  <h3 
                    dir="rtl" 
                    className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-serif leading-relaxed line-clamp-2"
                  >
                    {k.title_ar}
                  </h3>

                  {/* Indonesian Title */}
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 line-clamp-2">
                    <HighlightText text={k.title_id} highlight={searchQuery} />
                  </p>

                  {/* Summary */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-normal">
                    {k.summary_id}
                  </p>
                </div>

                {/* Direct Quick Action Buttons for Khutbah 1 & 2 */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenReader(k, 'k1')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all btn-press text-center"
                      title="Buka Khutbah 1"
                    >
                      Khutbah 1 ({k1Count})
                    </button>
                    <button
                      onClick={() => handleOpenReader(k, 'k2')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold transition-all btn-press text-center"
                      title="Buka Khutbah 2"
                    >
                      Khutbah 2 ({k2Count})
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenReader(k, 'full')}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 btn-press"
                  >
                    <span>Buka Naskah Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Khatib Reader & Translation Modal */}
      {activeKhutbah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur shrink-0">
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    {activeKhutbah.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Mode Mimbar & Terjemahan Lengkap
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                  {activeKhutbah.title_id}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveKhutbah(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 btn-press shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar: Font Size, Translation Modes, Khutbah Tabs, Copy, Print */}
            <div className="p-3 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
              {/* Tabs: Khutbah 1 / Khutbah 2 / Lengkap */}
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setReaderTab('full')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    readerTab === 'full'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Naskah Lengkap ({activeKhutbah.paragraphs?.length || 0})
                </button>
                <button
                  onClick={() => setReaderTab('k1')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    readerTab === 'k1'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Khutbah 1 ({getKhutbah1List(activeKhutbah).length})
                </button>
                <button
                  onClick={() => setReaderTab('k2')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    readerTab === 'k2'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Khutbah 2 ({getKhutbah2List(activeKhutbah).length})
                </button>
              </div>

              {/* Translation & View Modes */}
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setDisplayMode('bilingual')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                    displayMode === 'bilingual'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sejajar (Bilingual)</span>
                </button>
                <button
                  onClick={() => setDisplayMode('arabic')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                    displayMode === 'arabic'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>🇸🇦 Arab</span>
                </button>
                <button
                  onClick={() => setDisplayMode('indo')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                    displayMode === 'indo'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>🇮🇩 Terjemah</span>
                </button>
              </div>

              {/* Font Size & Action Buttons */}
              <div className="flex items-center space-x-1.5 ml-auto flex-wrap gap-y-1">
                {/* Arab Font Zoom */}
                {(displayMode === 'arabic' || displayMode === 'bilingual') && (
                  <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mr-1">🇸🇦 Arab</span>
                    <button
                      onClick={() => setArabicFontSize(prev => Math.max(16, prev - 2))}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Perkecil Font Arab"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold w-5 text-center text-slate-700 dark:text-slate-200">
                      {arabicFontSize}
                    </span>
                    <button
                      onClick={() => setArabicFontSize(prev => Math.min(44, prev + 2))}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Perbesar Font Arab"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Indonesian Font Zoom */}
                {(displayMode === 'indo' || displayMode === 'bilingual') && (
                  <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mr-1">🇮🇩 Terjemah</span>
                    <button
                      onClick={() => setIndoFontSize(prev => Math.max(12, prev - 1))}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Perkecil Font Terjemahan"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold w-5 text-center text-slate-700 dark:text-slate-200">
                      {indoFontSize}
                    </span>
                    <button
                      onClick={() => setIndoFontSize(prev => Math.min(32, prev + 1))}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Perbesar Font Terjemahan"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 font-bold flex items-center space-x-1.5 btn-press"
                  title="Salin Teks Naskah"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Tersalin' : 'Salin Teks'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 btn-press"
                  title="Cetak Naskah"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reader Content Body */}
            <div 
              ref={readerBodyRef}
              className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-950/50"
            >
              {/* Header Box in Reader */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    readerTab === 'k1' 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : readerTab === 'k2'
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}>
                    {readerTab === 'k1' ? '🟢 Sedang Membaca: KHUTBAH PERTAMA' : readerTab === 'k2' ? '🔵 Sedang Membaca: KHUTBAH KEDUA' : '📜 Sedang Membaca: NASKAH LENGKAP (Khutbah 1 & 2)'}
                  </span>
                </div>
                <h1 dir="rtl" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-serif leading-relaxed text-center">
                  {activeKhutbah.title_ar}
                </h1>
                <p className="text-base font-bold text-center text-emerald-700 dark:text-emerald-400">
                  {activeKhutbah.title_id}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xl mx-auto italic">
                  {activeKhutbah.summary_id}
                </p>
              </div>

              {/* Paragraphs Display */}
              <div className="space-y-6 max-w-3xl mx-auto">
                {activeParagraphs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
                    <p className="font-bold text-sm">Tidak ada paragraf pada bagian ini.</p>
                  </div>
                ) : (
                  activeParagraphs.map((p, idx) => (
                    <div
                      key={p.p_num || idx}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-xs"
                    >
                      {/* Paragraph Number Badge */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Paragraf {p.p_num || idx + 1}
                        </span>
                      </div>

                      {/* Arabic Paragraph */}
                      {(displayMode === 'arabic' || displayMode === 'bilingual') && (
                        <p
                          dir="rtl"
                          style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.2 }}
                          className="font-serif text-slate-900 dark:text-slate-100 font-medium tracking-wide text-right selection:bg-emerald-200 dark:selection:bg-emerald-900"
                        >
                          {p.arabic}
                        </p>
                      )}

                      {/* Full Indonesian Translation */}
                      {(displayMode === 'indo' || displayMode === 'bilingual') && (
                        <div 
                          style={{ fontSize: `${indoFontSize}px` }}
                          className={`text-slate-700 dark:text-slate-300 leading-relaxed font-sans ${
                            displayMode === 'bilingual' ? 'pt-3 border-t border-emerald-500/20 pl-3 border-l-2 border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 p-3 rounded-xl' : ''
                          }`}
                        >
                          {displayMode === 'bilingual' && (
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center space-x-1">
                              <Languages className="w-3.5 h-3.5" />
                              <span>Terjemahan Lengkap:</span>
                            </div>
                          )}
                          <p 
                            style={{ fontSize: `${indoFontSize}px`, lineHeight: 1.8 }}
                            className="whitespace-pre-line font-medium text-slate-800 dark:text-slate-200"
                          >
                            {p.indonesian || p.translation || "Terjemahan sedang diproses..."}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Quick Navigation between Khutbah 1 & 2 */}
              <div className="max-w-3xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
                {readerTab === 'k1' ? (
                  <button
                    onClick={() => setReaderTab('k2')}
                    className="w-full sm:w-auto ml-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md btn-press transition-all"
                  >
                    <span>Lanjut Baca Khutbah Kedua</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : readerTab === 'k2' ? (
                  <button
                    onClick={() => setReaderTab('k1')}
                    className="w-full sm:w-auto mr-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md btn-press transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Khutbah Pertama</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between gap-2">
                    <button
                      onClick={() => setReaderTab('k1')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 font-bold text-xs btn-press"
                    >
                      Buka Khutbah 1 Saja
                    </button>
                    <button
                      onClick={() => setReaderTab('k2')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-200 font-bold text-xs btn-press"
                    >
                      Buka Khutbah 2 Saja
                    </button>
                  </div>
                )}
              </div>

              {/* Reader Footer Note */}
              <div className="text-center text-xs text-slate-400 py-4 space-y-1">
                <p>Naskah resmi dari channel Telegram @daftarkajiansalafy</p>
                <p className="text-[10px]">Tersedia dalam format naskah Word & PDF</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

