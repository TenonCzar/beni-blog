const { requireAuth, cors } = require('./auth.cjs')
const { getClient } = require('./db.cjs')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  if (!requireAuth(event)) return cors({ error: 'Unauthorized' }, 401)
  if (event.httpMethod !== 'POST') return cors({ error: 'Method not allowed' }, 405)

  try {
    const { title, slug, excerpt, content, cover_image, author, status } = JSON.parse(event.body || '{}')

    if (!title || !slug) return cors({ error: 'title and slug are required' }, 400)

    const db = await getClient()
    const result = await db.execute(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, author, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt || '', content || '', cover_image || '', author || 'Editor', status || 'draft']
    )

    const newPost = await db.execute('SELECT * FROM posts WHERE id = ?', [result.lastInsertRowid])
    return cors({ post: newPost.rows[0] }, 201)
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return cors({ error: 'Slug already exists' }, 409)
    return cors({ error: e.message }, 500)
  }
}
