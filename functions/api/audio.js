import { createSmartMatcher } from './search_fuzzy.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const category = url.searchParams.get('category') || 'Semua';
  const ustadz = url.searchParams.get('ustadz') || 'Semua';
  const sortBy = url.searchParams.get('sortBy') || 'msg_desc';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 24;

  try {
    const dataUrl = new URL('/data/audio_catalog.json', context.request.url).toString();
    const res = await fetch(dataUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch audio catalog' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioData = await res.json();
    let filtered = audioData;

    if (category !== 'Semua') {
      filtered = filtered.filter(item => item.c === category);
    }

    if (ustadz !== 'Semua') {
      filtered = filtered.filter(item => item.u === ustadz);
    }

    if (q) {
      const matcher = createSmartMatcher(q);
      filtered = filtered.filter(item => {
        const searchTarget = `${item.t || ''} ${item.u || ''} ${item.k || ''} ${item.c || ''}`;
        return matcher(searchTarget);
      });
    }

    if (sortBy === 'msg_asc') {
      filtered = [...filtered].sort((a, b) => (a.m || 0) - (b.m || 0));
    } else if (sortBy === 'title_asc') {
      filtered = [...filtered].sort((a, b) => (a.t || '').localeCompare(b.t || ''));
    } else if (sortBy === 'title_desc') {
      filtered = [...filtered].sort((a, b) => (b.t || '').localeCompare(a.t || ''));
    } else if (sortBy === 'duration_desc') {
      filtered = [...filtered].sort((a, b) => (b.d || 0) - (a.d || 0));
    } else if (sortBy === 'duration_asc') {
      filtered = [...filtered].sort((a, b) => (a.d || 0) - (b.d || 0));
    } else {
      // default msg_desc
      filtered = [...filtered].sort((a, b) => (b.m || 0) - (a.m || 0));
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
