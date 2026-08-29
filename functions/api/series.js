import { createSmartMatcher } from './search_fuzzy.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const ustadz = url.searchParams.get('ustadz') || 'Semua';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;

  try {
    const dataUrl = new URL('/data/series.json', context.request.url).toString();
    const res = await fetch(dataUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch series catalog' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const seriesData = await res.json();
    let filtered = seriesData;

    if (ustadz !== 'Semua') {
      filtered = filtered.filter(item => item.ustadz === ustadz);
    }

    if (q) {
      const matcher = createSmartMatcher(q);
      filtered = filtered.filter(item => {
        const searchTarget = `${item.name || item.title || ''} ${item.ustadz || ''} ${item.category || ''}`;
        return matcher(searchTarget);
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    return new Response(JSON.stringify({
      items,
      total,
      page,
      limit,
      totalPages
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
