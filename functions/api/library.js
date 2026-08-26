export async function onRequestGet(context) {
  const db = context.env.DB;
  
  if (!db) {
    return Response.json({ error: "Database binding not found" }, { status: 500 });
  }

  const url = new URL(context.request.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || 'Semua';
  const author = url.searchParams.get('author') || 'Semua';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;
  
  try {
    let conditions = [];
    let params = [];
    
    if (category !== 'Semua') {
      conditions.push("category = ?");
      params.push(category);
    }
    
    if (author !== 'Semua') {
      conditions.push("author = ?");
      params.push(author);
    }
    
    if (q.trim()) {
      const searchTerms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      for (const term of searchTerms) {
        // Also check volumes JSON if possible, but SQLite LIKE on JSON string works for simple searches
        conditions.push("(LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(category) LIKE ? OR LOWER(volumes) LIKE ?)");
        const likeTerm = `%${term}%`;
        params.push(likeTerm, likeTerm, likeTerm, likeTerm);
      }
    }
    
    let whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    let orderClause = "ORDER BY id DESC";

    const countQuery = `SELECT COUNT(*) as total FROM library_catalog ${whereClause}`;
    const dataQuery = `SELECT * FROM library_catalog ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    
    const countParams = [...params];
    const dataParams = [...params, limit, (page - 1) * limit];

    const [countResult, dataResult] = await Promise.all([
      db.prepare(countQuery).bind(...countParams).first(),
      db.prepare(dataQuery).bind(...dataParams).all()
    ]);

    // Parse JSON volumes
    const items = dataResult.results.map(r => ({
      ...r,
      volumes: r.volumes ? JSON.parse(r.volumes) : []
    }));

    return Response.json({
      items,
      total: countResult.total,
      page,
      limit,
      totalPages: Math.ceil(countResult.total / limit)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
