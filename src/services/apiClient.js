// Bulletproof API Client with Instant Static Fallback & In-Memory Cache

let _cache = {
  stats: null,
  asatidzah: null,
  authors: null,
  audio: null,
  books: null,
  series: null,
  khutbah: null
};

// Simple Arabic normalization for client-side search fallback
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic harakat
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[-_.,/\\()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    if (text.trim().startsWith('<')) return null; // Catch HTML 404/SPA responses
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export async function getMetadata() {
  // 1. Try API endpoint
  const apiData = await safeFetchJson('/api/metadata');
  if (apiData && apiData.stats) {
    return apiData;
  }

  // 2. Direct Static Fallback from /data/
  if (!_cache.stats || !_cache.asatidzah || !_cache.authors) {
    const [stats, asatidzah, authors] = await Promise.all([
      safeFetchJson('/data/stats.json'),
      safeFetchJson('/data/asatidzah.json'),
      safeFetchJson('/data/book_authors.json')
    ]);
    _cache.stats = stats || {
      total_kajian: 36841,
      total_audio: 32494,
      total_books: 1403,
      total_series: 442,
      total_asatidzah: 137,
      total_book_authors: 75,
      total_khutbah: 30
    };
    _cache.asatidzah = asatidzah || [];
    _cache.authors = authors || [];
  }

  const categories = [
    'Semua', 'Akidah', 'Fiqh', 'Hadits', 'Tafsir', 
    'Adab & Akhlak', 'Manhaj', 'Sirah', 'Dauroh', 
    'Khutbah Jum\'at', 'Tanya Jawab', 'Tematik'
  ];

  return {
    categories,
    asatidzah: _cache.asatidzah,
    authors: _cache.authors,
    stats: _cache.stats
  };
}

export async function getAudioCatalog({ q = '', category = 'Semua', ustadz = 'Semua', sortBy = 'msg_desc', page = 1, limit = 24 } = {}) {
  // 1. Try API endpoint
  const params = new URLSearchParams({ q, category, ustadz, sortBy, page: String(page), limit: String(limit) });
  const apiData = await safeFetchJson(`/api/audio?${params.toString()}`);
  if (apiData && Array.isArray(apiData.items) && apiData.items.length >= 0 && apiData.total !== undefined) {
    return apiData;
  }

  // 2. Direct Static Fallback
  if (!_cache.audio) {
    _cache.audio = (await safeFetchJson('/data/audio_catalog.json')) || [];
  }

  let filtered = _cache.audio;

  if (category !== 'Semua') {
    filtered = filtered.filter(item => item.c === category);
  }

  if (ustadz !== 'Semua') {
    filtered = filtered.filter(item => item.u === ustadz);
  }

  if (q.trim()) {
    const qNorm = normalizeText(q);
    const qTokens = qNorm.split(' ').filter(Boolean);
    filtered = filtered.filter(item => {
      const target = normalizeText(`${item.t || ''} ${item.u || ''} ${item.k || ''} ${item.c || ''}`);
      return qTokens.every(token => target.includes(token));
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

  return { items, total, page, limit, totalPages };
}

export async function getLibraryBooks({ q = '', category = 'Semua', author = 'Semua', page = 1, limit = 12 } = {}) {
  // 1. Try API endpoint
  const params = new URLSearchParams({ q, category, author, page: String(page), limit: String(limit) });
  const apiData = await safeFetchJson(`/api/library?${params.toString()}`);
  if (apiData && Array.isArray(apiData.items) && apiData.items.length >= 0 && apiData.total !== undefined) {
    return apiData;
  }

  // 2. Direct Static Fallback
  if (!_cache.books) {
    _cache.books = (await safeFetchJson('/data/books.json')) || [];
  }

  let filtered = _cache.books;

  if (category !== 'Semua') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (author !== 'Semua') {
    filtered = filtered.filter(item => item.author === author);
  }

  if (q.trim()) {
    const qNorm = normalizeText(q);
    const qTokens = qNorm.split(' ').filter(Boolean);
    filtered = filtered.filter(item => {
      const target = normalizeText(`${item.title || ''} ${item.author || ''} ${item.category || ''}`);
      return qTokens.every(token => target.includes(token));
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = filtered.slice(offset, offset + limit);

  return { items, total, page, limit, totalPages };
}

export async function getSeriesCatalog({ q = '', ustadz = 'Semua', page = 1, limit = 12 } = {}) {
  // 1. Try API endpoint
  const params = new URLSearchParams({ q, ustadz, page: String(page), limit: String(limit) });
  const apiData = await safeFetchJson(`/api/series?${params.toString()}`);
  if (apiData && Array.isArray(apiData.items) && apiData.items.length >= 0 && apiData.total !== undefined) {
    return apiData;
  }

  // 2. Direct Static Fallback
  if (!_cache.series) {
    _cache.series = (await safeFetchJson('/data/series.json')) || [];
  }

  let filtered = _cache.series;

  if (ustadz !== 'Semua') {
    filtered = filtered.filter(item => item.ustadz === ustadz);
  }

  if (q.trim()) {
    const qNorm = normalizeText(q);
    const qTokens = qNorm.split(' ').filter(Boolean);
    filtered = filtered.filter(item => {
      const target = normalizeText(`${item.name || item.title || ''} ${item.ustadz || ''} ${item.category || ''}`);
      return qTokens.every(token => target.includes(token));
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = filtered.slice(offset, offset + limit);

  return { items, total, page, limit, totalPages };
}
