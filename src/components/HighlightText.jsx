import React from 'react';

export default function HighlightText({ text = '', highlight = '' }) {
  if (!highlight || !highlight.trim() || !text) {
    return <span>{text}</span>;
  }

  const cleanHighlight = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${cleanHighlight})`, 'gi');
  const parts = String(text).split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
