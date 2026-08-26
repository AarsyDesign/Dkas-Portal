import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import ShareModal from './components/ShareModal';
import BookmarksModal from './components/BookmarksModal';

import HomeView from './views/HomeView';
import CatalogView from './views/CatalogView';
import LibraryView from './views/LibraryView';
import SeriesView from './views/SeriesView';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dkas_theme') || 'dark';
  });

  // Active Tab: 'home' | 'catalog' | 'library' | 'series'
  const [activeTab, setActiveTab] = useState('home');

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

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackQueue, setTrackQueue] = useState([]);
  const [trackIndex, setTrackIndex] = useState(0);

  // Modal State
  const [sharingItem, setSharingItem] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

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

  // Load lightweight metadata from API
  useEffect(() => {
    async function loadMetadata() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/metadata');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setAsatidzahList(data.asatidzah || []);
          setBookAuthors(data.authors || []);
        }
      } catch (err) {
        console.error("Gagal memuat metadata portal:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetadata();
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

  // Play audio track
  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  const handleNextTrack = () => {
    if (trackQueue.length > 0 && trackIndex < trackQueue.length - 1) {
      setTrackIndex(trackIndex + 1);
      setCurrentTrack(trackQueue[trackIndex + 1]);
    }
  };

  const handlePrevTrack = () => {
    if (trackQueue.length > 0 && trackIndex > 0) {
      setTrackIndex(trackIndex - 1);
      setCurrentTrack(trackQueue[trackIndex - 1]);
    }
  };

  const handleFocusSearch = () => {
    if (activeTab !== 'catalog') {
      setActiveTab('catalog');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
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
                  setActiveTab('catalog');
                }}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveTab('catalog');
                }}
                onNavigateTab={setActiveTab}
                featuredBooks={books}
                featuredSeries={seriesList}
                onPlayTrack={handlePlayTrack}
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
                onPlayTrack={handlePlayTrack}
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

            {activeTab === 'series' && (
              <SeriesView
                seriesList={seriesList}
                onPlayTrack={handlePlayTrack}
                onShareItem={setSharingItem}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Audio Mini-Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        theme={theme}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onClose={() => setCurrentTrack(null)}
      />

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
          onPlayTrack={handlePlayTrack}
          onClose={() => setIsBookmarksOpen(false)}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Daftar Kajian Asatidzah Salafiyah & Perpustakaan Kitab Ulama
          </p>
          <p className="text-[11px]">
            Khazanah ilmiah Ahlussunnah wal Jama'ah • Diindeks dari channel Telegram <a href="https://t.me/daftarkajiansalafy" target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">@daftarkajiansalafy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
