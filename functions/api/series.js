export async function onRequestGet(context) {
  const db = context.env.DB;
  
  if (!db) {
    return Response.json({ error: "Database binding not found" }, { status: 500 });
  }

  const url = new URL(context.request.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || 'Semua';
  const ustadz = url.searchParams.get('ustadz') || 'Semua';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;
  
  try {
    let conditions = [];
    let params = [];
    
    if (category !== 'Semua') {
      conditions.push("category = ?");
      params.push(category);
    }
    
    if (ustadz !== 'Semua') {
      conditions.push("ustadz = ?");
      params.push(ustadz);
    }
    
    if (q.trim()) {
      const searchTerms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      for (const term of searchTerms) {
        conditions.push("(LOWER(title) LIKE ? OR LOWER(ustadz) LIKE ? OR LOWER(category) LIKE ?)");
        const likeTerm = `%${term}%`;
        params.push(likeTerm, likeTerm, likeTerm);
      }
    }
    
    let whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    let orderClause = "ORDER BY id DESC";

    const countQuery = `SELECT COUNT(*) as total FROM series_catalog ${whereClause}`;
    const dataQuery = `SELECT * FROM series_catalog ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    
    const countParams = [...params];
    const dataParams = [...params, limit, (page - 1) * limit];

    const [countResult, dataResult] = await Promise.all([
      db.prepare(countQuery).bind(...countParams).first(),
      db.prepare(dataQuery).bind(...dataParams).all()
    ]);

    const items = dataResult.results.map(r => ({
      ...r,
      episodes: r.episodes ? JSON.parse(r.episodes) : []
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
