const { requireAuth, cors } = require('./auth')
const { getClient } = require('./db')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  if (!requireAuth(event)) return cors({ error: 'Unauthorized' }, 401)
  if (event.httpMethod !== 'PUT') return cors({ error: 'Method not allowed' }, 405)

  try {
    const id = event.queryStringParameters?.id
    if (!id) return cors({ error: 'id is required' }, 400)

    const { title, slug, excerpt, content, cover_image, author, status } = JSON.parse(event.body || '{}')

    const db = await getClient()
    await db.execute(
      `UPDATE posts
       SET title=?, slug=?, excerpt=?, content=?, cover_image=?, author=?, status=?, updated_at=datetime('now')
       WHERE id=?`,
      [title, slug, excerpt || '', content || '', cover_image || '', author || 'Editor', status || 'draft', id]
    )

    const updated = await db.execute('SELECT * FROM posts WHERE id = ?', [id])
    if (!updated.rows[0]) return cors({ error: 'Post not found' }, 404)

    return cors({ post: updated.rows[0] })
  } catch (e) {
    return cors({ error: e.message }, 500)
  }
}
