import { createSmartMatcher } from './search_fuzzy.js';

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const category = url.searchParams.get('category') || 'Semua';
  const id = url.searchParams.get('id');

  try {
    const dataUrl = new URL('/data/khutbah_texts.json', request.url).toString();
    const res = await fetch(dataUrl);
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to load khutbah texts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const khutbahData = await res.json();

    if (id) {
      const item = khutbahData.find(k => String(k.id) === String(id) || String(k.msg_id) === String(id));
      return new Response(JSON.stringify(item || { error: 'Not found' }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    let filtered = khutbahData;

    if (category !== 'Semua') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (q) {
      const matcher = createSmartMatcher(q);
      filtered = filtered.filter(item => {
        const searchTarget = `${item.title_ar || ''} ${item.title_id || ''} ${item.summary_id || ''} ${item.full_arabic_text || ''} ${item.full_indonesian_text || ''}`;
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
