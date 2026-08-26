import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Music, 
  ChevronUp, 
  ChevronDown,
  Volume2,
  Radio
} from 'lucide-react';

export default function AudioPlayer({ currentTrack, theme = 'dark', onNext, onPrev, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentTrack) return null;

  const msgId = currentTrack?.m || currentTrack?.msg_id || currentTrack?.telegram_msg_id;
  const title = currentTrack?.t || currentTrack?.title || 'Kajian Audio';
  const ustadz = currentTrack?.u || currentTrack?.ustadz || 'Asatidzah';
  const telegramLink = currentTrack?.l || currentTrack?.link || currentTrack?.telegram_link || (msgId ? `https://t.me/daftarkajiansalafy/${msgId}` : '');

  const handleCopyLink = () => {
    if (!telegramLink) return;
    navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Embed URL for Telegram Post Widget
  const embedUrl = msgId 
    ? `https://t.me/daftarkajiansalafy/${msgId}?embed=1${theme === 'dark' ? '&dark=1' : ''}&single=1`
    : null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-[480px] z-50 animate-enter-natural">
      <div className="p-3.5 sm:p-4 rounded-3xl glass-panel shadow-2xl border border-emerald-500/30 bg-slate-950/95 text-white backdrop-blur-2xl space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-100 truncate" title={title}>
                {title}
              </h4>
              <p className="text-[11px] text-emerald-400 font-semibold truncate">
                🎙️ {ustadz}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 btn-press"
              title={isMinimized ? 'Perbesar Pemutar' : 'Kecilkan'}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 btn-press"
              title="Tutup Pemutar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telegram In-Browser Player Widget (Shown when not minimized) */}
        {!isMinimized && (
          <div className="space-y-2 pt-1">
            {embedUrl ? (
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex flex-col justify-center">
                {/* Official Telegram Embedded Audio Streamer */}
                <iframe
                  key={msgId}
                  src={embedUrl}
                  className="w-full h-[155px] sm:h-[160px] border-0 rounded-2xl bg-transparent"
                  scrolling="no"
                  frameBorder="0"
                  allow="autoplay"
                  title="Pemutar Audio Telegram"
                />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-900 text-center text-xs text-slate-400">
                Pilih kajian audio untuk memutar
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Stream Audio Telegram</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 btn-press"
                  title="Salin Tautan Telegram"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{copied ? 'Tersalin' : 'Salin'}</span>
                </button>

                {telegramLink && (
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 font-bold flex items-center space-x-1 btn-press"
                    title="Buka Langsung di Aplikasi Telegram"
                  >
                    <span className="text-[10px]">Aplikasi Telegram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
