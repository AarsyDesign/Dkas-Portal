import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Play, 
  Music, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';

export default function BookmarksModal({ 
  bookmarks = [], 
  onRemoveBookmark, 
  onPlayTrack, 
  onClose,
  onNavigateTab 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter-natural">
      <div className="w-full max-w-lg p-5 sm:p-6 rounded-3xl glass-panel shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Kajian & Kitab Tersimpan
              </h3>
              <p className="text-[11px] text-slate-500">
                Tersimpan di memori browser HP Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 btn-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar min-h-[160px]">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Belum ada kajian atau kitab yang disimpan.</p>
              <p className="text-[11px]">Klik ikon bookmark pada audio atau kitab untuk menyimpannya di sini.</p>
            </div>
          ) : (
            bookmarks.map((item) => {
              const isBook = item.type === 'book' || item.volumes_count;
              const title = item.t || item.title;
              const ustadz = item.u || item.ustadz || item.author;
              const link = item.l || item.telegram_link || (item.m ? `https://t.me/daftarkajiansalafy/${item.m}` : '');

              return (
                <div
                  key={item.id || item.i || title}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                      {isBook ? <BookOpen className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs" title={title}>
                        {title}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                        {ustadz}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {!isBook && (
                      <button
                        onClick={() => {
                          onPlayTrack(item);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 btn-press"
                        title="Putar Audio"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>
                    )}
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950 btn-press"
                        title="Buka di Telegram"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onRemoveBookmark(item)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 btn-press"
                      title="Hapus Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
