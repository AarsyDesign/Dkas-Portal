let _cachedMetadata = null;

export async function onRequestGet(context) {
  try {
    if (!_cachedMetadata) {
      const statsUrl = new URL('/data/stats.json', context.request.url).toString();
      const asatidzahUrl = new URL('/data/asatidzah.json', context.request.url).toString();
      const authorsUrl = new URL('/data/book_authors.json', context.request.url).toString();

      const [statsRes, asatidzahRes, authorsRes] = await Promise.all([
        fetch(statsUrl),
        fetch(asatidzahUrl),
        fetch(authorsUrl)
      ]);

      const stats = statsRes.ok ? await statsRes.json() : null;
      const asatidzah = asatidzahRes.ok ? await asatidzahRes.json() : [];
      const authors = authorsRes.ok ? await authorsRes.json() : [];

      const categories = [
        'Semua', 'Akidah', 'Fiqh', 'Hadits', 'Tafsir', 
        'Adab & Akhlak', 'Manhaj', 'Sirah', 'Dauroh', 
        'Khutbah Jum\'at', 'Tanya Jawab', 'Tematik'
      ];

      _cachedMetadata = {
        categories,
        asatidzah,
        authors,
        stats
      };
    }

    return new Response(JSON.stringify(_cachedMetadata), {
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
