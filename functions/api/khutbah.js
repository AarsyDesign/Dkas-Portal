import { createSmartMatcher } from './search_fuzzy.js';

let _cachedCatalog = null;
let _cachedFull = null;

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const category = url.searchParams.get('category') || 'Semua';
  const id = url.searchParams.get('id');
  const mode = url.searchParams.get('mode'); // 'full' or default 'catalog'

  try {
    // If a specific ID is requested or mode === 'full', fetch full texts
    if (id || mode === 'full') {
      if (!_cachedFull) {
        const fullUrl = new URL('/data/khutbah_texts.json', request.url).toString();
        const resFull = await fetch(fullUrl);
        if (resFull.ok) {
          _cachedFull = await resFull.json();
        }
      }

      if (id) {
        const item = (_cachedFull || []).find(k => String(k.id) === String(id) || String(k.telegram_msg_id) === String(id) || String(k.msg_id) === String(id));
        return new Response(JSON.stringify(item || { error: 'Not found' }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }
    }

    // Otherwise, serve lightweight catalog (34 KB instead of 10.4 MB)
    if (!_cachedCatalog) {
      const catUrl = new URL('/data/khutbah_catalog.json', request.url).toString();
      const resCat = await fetch(catUrl);
      if (resCat.ok) {
        _cachedCatalog = await resCat.json();
      } else {
        // Fallback to full data if catalog is missing
        if (!_cachedFull) {
          const fullUrl = new URL('/data/khutbah_texts.json', request.url).toString();
          const resFull = await fetch(fullUrl);
          if (resFull.ok) _cachedFull = await resFull.json();
        }
        _cachedCatalog = (_cachedFull || []).map(k => ({
          id: k.id,
          telegram_msg_id: k.telegram_msg_id || k.id,
          title_ar: k.title_ar,
          title_id: k.title_id,
          category: k.category || 'Khutbah Jum\'at',
          summary_id: k.summary_id || '',
          paragraphs_count: (k.paragraphs && k.paragraphs.length) || 0,
          k1_count: (k.khutbah_1 && k.khutbah_1.length) || Math.ceil(((k.paragraphs && k.paragraphs.length) || 0) / 2),
          k2_count: (k.khutbah_2 && k.khutbah_2.length) || Math.floor(((k.paragraphs && k.paragraphs.length) || 0) / 2),
          est_reading_time: 5
        }));
      }
    }

    let filtered = _cachedCatalog;

    if (category !== 'Semua') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (q) {
      const matcher = createSmartMatcher(q);
      filtered = filtered.filter(item => {
        const searchTarget = `${item.title_ar || ''} ${item.title_id || ''} ${item.summary_id || ''} ${item.category || ''}`;
        return matcher(searchTarget);
      });
    }

    return new Response(JSON.stringify({
      items: filtered,
      total: filtered.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
