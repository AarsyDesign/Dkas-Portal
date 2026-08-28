import { buildSmartSearchSql } from './search_fuzzy.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  
  if (!db) {
    return Response.json({ error: "Database binding not found" }, { status: 500 });
  }

  const url = new URL(context.request.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || 'Semua';
  const ustadz = url.searchParams.get('ustadz') || 'Semua';
  const sortBy = url.searchParams.get('sortBy') || 'msg_desc';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 24;
  
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
      const { conditionSql, params: searchParams } = buildSmartSearchSql(q, ['title', 'ustadz', 'kitab', 'category']);
      if (conditionSql) {
        conditions.push(conditionSql);
        params.push(...searchParams);
      }
    }
    
    let whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    
    let orderClause = "ORDER BY msg_id DESC";
    if (sortBy === 'msg_asc') orderClause = "ORDER BY msg_id ASC";
    else if (sortBy === 'title_asc') orderClause = "ORDER BY title ASC";
    else if (sortBy === 'title_desc') orderClause = "ORDER BY title DESC";
    else if (sortBy === 'duration_desc') orderClause = "ORDER BY duration DESC";
    else if (sortBy === 'duration_asc') orderClause = "ORDER BY duration ASC";

    const countQuery = `SELECT COUNT(*) as total FROM audio_catalog ${whereClause}`;
    const dataQuery = `SELECT * FROM audio_catalog ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    
    const countParams = [...params];
    const dataParams = [...params, limit, (page - 1) * limit];

    const [countResult, dataResult] = await Promise.all([
      db.prepare(countQuery).bind(...countParams).first(),
      db.prepare(dataQuery).bind(...dataParams).all()
    ]);

    // Map output to match existing app format to avoid large frontend changes
    const items = dataResult.results.map(r => ({
      i: r.id,
      t: r.title,
      u: r.ustadz,
      k: r.kitab,
      c: r.category,
      d: r.duration,
      s: r.size,
      m: r.msg_id,
      l: r.link
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
