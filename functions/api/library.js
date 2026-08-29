import { createSmartMatcher } from './search_fuzzy.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const category = url.searchParams.get('category') || 'Semua';
  const author = url.searchParams.get('author') || 'Semua';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;

  try {
    const dataUrl = new URL('/data/books.json', context.request.url).toString();
    const res = await fetch(dataUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch library books' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const booksData = await res.json();
    let filtered = booksData;

    if (category !== 'Semua') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (author !== 'Semua') {
      filtered = filtered.filter(item => item.author === author);
    }

    if (q) {
      const matcher = createSmartMatcher(q);
      filtered = filtered.filter(item => {
        const searchTarget = `${item.title || ''} ${item.author || ''} ${item.category || ''}`;
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
