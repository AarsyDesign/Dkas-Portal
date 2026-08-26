import React from 'react';
import { 
  BookOpen, 
  Music, 
  Library, 
  ListMusic, 
  Bookmark, 
  Sun, 
  Moon, 
  Send,
  Home,
  Search,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  bookmarksCount = 0,
  onOpenBookmarks,
  onFocusSearch
}) {
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
    { id: 'series', label: 'Seri & Playlist', icon: ListMusic },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group btn-press"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-500/30">
              <img 
                src="/logo.png" 
                alt="Daftar Kajian Salafy" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Daftar Kajian
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  Salafy
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Arsip Audio & Perpustakaan Kitab Ulama
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all btn-press ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Bookmarks, Theme, Telegram) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Quick Search Shortcut */}
            <button
              onClick={onFocusSearch}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium flex items-center space-x-1.5 btn-press"
              title="Cari Cepat"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Cari</span>
            </button>

            {/* Bookmarks / Saved Button */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 btn-press"
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
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 btn-press"
              title="Ganti Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Telegram Channel Button */}
            <a
              href="https://t.me/daftarkajiansalafy"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 text-xs font-bold btn-press"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@daftarkajiansalafy</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
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
