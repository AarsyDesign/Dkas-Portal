import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Music, 
  Library, 
  ListMusic, 
  Bookmark, 
  Bell,
  BellOff,
  Sun, 
  Moon, 
  Send,
  Home,
  Search,
  Sparkles,
  ScrollText
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  bookmarksCount = 0,
  onOpenBookmarks,
  onOpenPatchNotes,
  onFocusSearch
}) {
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const syncState = async () => {
      if (window.PushNotif && typeof window.PushNotif.isSubscribed === 'function') {
        const on = await window.PushNotif.isSubscribed();
        setPushEnabled(on);
      }
    };
    syncState();
    const handler = (e) => {
      if (e && e.detail && typeof e.detail.subscribed === 'boolean') {
        setPushEnabled(e.detail.subscribed);
      }
    };
    window.addEventListener('pushnotif:state', handler);
    return () => window.removeEventListener('pushnotif:state', handler);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dkas_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'catalog', label: 'Audio Kajian', icon: Music },
    { id: 'library', label: 'Perpustakaan Kitab', icon: Library },
    { id: 'khutbah', label: 'Teks Khutbah', icon: ScrollText },
    { id: 'series', label: 'Seri & Playlist', icon: ListMusic },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group btn-press shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-500/30 shrink-0">
              <img 
                src="/logo.png" 
                alt="Daftar Kajian Salafy" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-nowrap">
                <span className="text-[15px] sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  Daftar Kajian
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden 2xl:block truncate">
                Arsip Audio & Perpustakaan Kitab Ulama
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all btn-press whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Bookmarks, Theme, Version, Telegram) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Quick Search Shortcut */}
            <button
              onClick={onFocusSearch}
              className="p-2 xl:px-2.5 xl:py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium flex items-center space-x-1.5 btn-press shrink-0"
              title="Cari Cepat"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">Cari</span>
            </button>

            {/* Strategic PushNotif Toggle (ON/OFF) Bell Button */}
            <button
              onClick={async () => {
                if (window.PushNotif) {
                  try {
                    const res = await window.PushNotif.toggle();
                    setPushEnabled(Boolean(res && res.subscribed));
                  } catch (e) {
                    if (window.PushNotif.showToast) {
                      window.PushNotif.showToast(e.message || String(e), false);
                    }
                  }
                }
              }}
              className={`relative p-2 rounded-xl border btn-press shrink-0 transition-colors ${
                pushEnabled
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border-slate-200/80 dark:border-slate-800/80'
              }`}
              title={pushEnabled ? 'Notifikasi Aktif (Ketuk untuk Matikan / OFF)' : 'Aktifkan Notifikasi Pengingat Kajian'}
            >
              <Bell className={`w-4 h-4 ${pushEnabled ? 'text-emerald-500 fill-emerald-500/25' : 'text-emerald-600 dark:text-emerald-400'}`} />
              {pushEnabled && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            {/* Bookmarks / Saved Button */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 btn-press shrink-0"
              title="Kajian & Kitab Tersimpan"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarksCount > 9 ? '9+' : bookmarksCount}
                </span>
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 btn-press shrink-0"
              title="Ganti Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Patch Notes Version Button */}
            <button
              onClick={onOpenPatchNotes}
              className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-800/80 text-[11px] font-mono font-bold flex items-center space-x-1 btn-press shrink-0 transition-colors"
              title="Catatan Rilis & Pembaruan (v2.1.0)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden xl:inline">v2.1.0</span>
            </button>

            {/* Telegram Channel Button */}
            <a
              href="https://t.me/daftarkajiansalafy"
              target="_blank"
              rel="noreferrer"
              className="hidden 2xl:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 text-xs font-bold btn-press shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@daftarkajiansalafy</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Sub-Navigation Bar */}
      <div className="flex lg:hidden items-center justify-around px-2 py-1.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 py-1.5 rounded-xl font-bold flex flex-col items-center justify-center space-y-0.5 btn-press transition-colors ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
