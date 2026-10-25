import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ShareModal from './components/ShareModal';
import BookmarksModal from './components/BookmarksModal';
import PatchNotesModal from './components/PatchNotesModal';

import HomeView from './views/HomeView';
import CatalogView from './views/CatalogView';
import LibraryView from './views/LibraryView';
import KhutbahView from './views/KhutbahView';
import SeriesView from './views/SeriesView';
import { Loader2 } from 'lucide-react';

import { getMetadata, getLibraryBooks, getSeriesCatalog } from './services/apiClient';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dkas_theme') || 'dark';
  });

  // Helper to extract tab from URL hash
  const getTabFromHash = () => {
    const hash = (window.location.hash || '').replace('#', '').trim().toLowerCase();
    const validTabs = ['home', 'catalog', 'library', 'khutbah', 'series'];
    if (validTabs.includes(hash)) return hash;
    return 'home';
  };

  // Active Tab: 'home' | 'catalog' | 'library' | 'khutbah' | 'series'
  const [activeTab, setActiveTab] = useState(() => getTabFromHash());

  // Search & Global Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedUstadz, setSelectedUstadz] = useState('Semua');

  // Data State (Loaded from compressed static JSON in /data/)
  const [stats, setStats] = useState(null);
  const [audioCatalog, setAudioCatalog] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookAuthors, setBookAuthors] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [asatidzahList, setAsatidzahList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [sharingItem, setSharingItem] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);

  // Navigate Tab with URL Hash & Browser History
  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    const targetHash = tab === 'home' ? '' : `#${tab}`;
    if (window.location.hash !== targetHash) {
      if (tab === 'home') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = tab;
      }
    }
  };

  // Listen to browser Back/Forward (hashchange & popstate)
  useEffect(() => {
    const handleHashSync = () => {
      const tab = getTabFromHash();
      setActiveTab(tab);
    };
    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K or / to focus search, Esc to dismiss modal)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBookmarksOpen) setIsBookmarksOpen(false);
        if (isPatchNotesOpen) setIsPatchNotesOpen(false);
        if (sharingItem) setSharingItem(null);
      }
      if (
        (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')
      ) {
        e.preventDefault();
        handleNavigateTab('catalog');
        setTimeout(() => {
          const input = document.querySelector('input[type="text"]');
          if (input) input.focus();
        }, 60);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isBookmarksOpen, isPatchNotesOpen, sharingItem]);

  // Bookmarks State (Saved locally in user browser)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dkas_saved_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // Sync theme to DOM on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load lightweight metadata and home featured items from API or resilient static fallback
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [metaData, booksData, seriesData] = await Promise.all([
          getMetadata(),
          getLibraryBooks({ limit: 4 }),
          getSeriesCatalog({ limit: 3 })
        ]);

        if (metaData) {
          setStats(metaData.stats);
          setAsatidzahList(metaData.asatidzah || []);
          setBookAuthors(metaData.authors || []);
        }

        if (booksData) {
          setBooks(booksData.items || []);
        }

        if (seriesData) {
          setSeriesList(seriesData.items || []);
        }
      } catch (err) {
        console.error("Gagal memuat data portal:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Save bookmarks to localStorage
  const handleToggleBookmark = (item) => {
    const itemId = item.id || item.i || item.title || item.t;
    setBookmarks(prev => {
      const exists = prev.some(b => (b.id || b.i || b.title || b.t) === itemId);
      let updated;
      if (exists) {
        updated = prev.filter(b => (b.id || b.i || b.title || b.t) !== itemId);
      } else {
        updated = [item, ...prev];
      }
      localStorage.setItem('dkas_saved_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveBookmark = (item) => {
    const itemId = item.id || item.i || item.title || item.t;
    setBookmarks(prev => {
      const updated = prev.filter(b => (b.id || b.i || b.title || b.t) !== itemId);
      localStorage.setItem('dkas_saved_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (item) => {
    const itemId = item.id || item.i || item.title || item.t;
    return bookmarks.some(b => (b.id || b.i || b.title || b.t) === itemId);
  };


  const handleFocusSearch = () => {
    if (activeTab !== 'catalog') {
      handleNavigateTab('catalog');
    }
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) input.focus();
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        theme={theme}
        setTheme={setTheme}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenPatchNotes={() => setIsPatchNotesOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-28">
        {isLoading ? (
          <div className="py-24 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center space-y-3 glass-panel rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="font-semibold text-sm">Menyiapkan khazanah kajian & kitab...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                stats={stats}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={(q) => {
                  setSearchQuery(q);
                  handleNavigateTab('catalog');
                }}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  handleNavigateTab('catalog');
                }}
                onNavigateTab={handleNavigateTab}
                featuredBooks={books}
                featuredSeries={seriesList}
              />
            )}

            {activeTab === 'catalog' && (
              <CatalogView
                audioCatalog={audioCatalog}
                asatidzahList={asatidzahList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedUstadz={selectedUstadz}
                setSelectedUstadz={setSelectedUstadz}
                onShareItem={setSharingItem}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={isBookmarked}
              />
            )}

            {activeTab === 'library' && (
              <LibraryView
                books={books}
                authors={bookAuthors}
                onShareItem={setSharingItem}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={isBookmarked}
              />
            )}

            {activeTab === 'khutbah' && (
              <KhutbahView />
            )}

            {activeTab === 'series' && (
              <SeriesView
                seriesList={seriesList}
                asatidzahList={asatidzahList}
                onShareItem={setSharingItem}
              />
            )}
          </>
        )}
      </main>


      {/* Share Modal */}
      {sharingItem && (
        <ShareModal
          item={sharingItem}
          onClose={() => setSharingItem(null)}
        />
      )}

      {/* Bookmarks Modal */}
      {isBookmarksOpen && (
        <BookmarksModal
          bookmarks={bookmarks}
          onRemoveBookmark={handleRemoveBookmark}
          onClose={() => setIsBookmarksOpen(false)}
          onNavigateTab={handleNavigateTab}
        />
      )}

      {/* Patch Notes Modal */}
      <PatchNotesModal
        isOpen={isPatchNotesOpen}
        onClose={() => setIsPatchNotesOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <div className="flex items-center justify-center space-x-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Daftar Kajian Asatidzah Salafiyah & Perpustakaan Kitab Ulama
            </p>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setIsPatchNotesOpen(true)}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>v2.1.0 Patch Notes</span>
            </button>
          </div>
          <p className="text-[11px]">
            Khazanah ilmiah Ahlussunnah wal Jama'ah • Diindeks dari channel Telegram <a href="https://t.me/daftarkajiansalafy" target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">@daftarkajiansalafy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
