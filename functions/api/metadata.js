export async function onRequestGet(context) {
  const db = context.env.DB;
  
  if (!db) {
    return Response.json({ error: "Database binding not found" }, { status: 500 });
  }
  
  try {
    const [categories, asatidzah, authors, stats] = await Promise.all([
      db.prepare("SELECT name FROM categories").all(),
      db.prepare("SELECT name, count FROM asatidzah ORDER BY count DESC").all(),
      db.prepare("SELECT name, books_count, total_pages FROM authors ORDER BY books_count DESC").all(),
      db.prepare("SELECT * FROM stats ORDER BY id DESC LIMIT 1").first()
    ]);

    return Response.json({
      categories: categories.results.map(r => r.name),
      asatidzah: asatidzah.results,
      authors: authors.results,
      stats: stats || null
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
