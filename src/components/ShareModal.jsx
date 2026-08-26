import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

export default function ShareModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const title = item.t || item.title || 'Kajian Salafy';
  const ustadz = item.u || item.ustadz || item.author || 'Asatidzah';
  const link = item.l || item.telegram_link || item.link || (item.m ? `https://t.me/daftarkajiansalafy/${item.m}` : window.location.href);

  const shareText = `🎙️ *${title}*\n👤 Pemateri: ${ustadz}\n\n🔗 Dengarkan / Buka di Telegram:\n${link}\n\n_Disalin dari Portal Daftar Kajian Salafy_`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎙️ ${title}\n👤 ${ustadz}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter-natural">
      <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl glass-panel shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Bagikan Kajian / Kitab</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 btn-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Preview */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{title}</p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{ustadz}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm btn-press"
          >
            <span>💬 WhatsApp</span>
          </button>
          <button
            onClick={handleShareTelegram}
            className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm btn-press"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </button>
        </div>

        <button
          onClick={handleCopyText}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 btn-press"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Teks & Link Berhasil Disalin!' : 'Salin Teks Lengkap & Tautan'}</span>
        </button>
      </div>
    </div>
  );
}
