const { requireAuth, cors } = require('./auth.cjs')
const { getClient } = require('./db.cjs')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  if (!requireAuth(event)) return cors({ error: 'Unauthorized' }, 401)
  if (event.httpMethod !== 'DELETE') return cors({ error: 'Method not allowed' }, 405)

  try {
    const id = event.queryStringParameters?.id
    if (!id) return cors({ error: 'id is required' }, 400)

    const db = await getClient()

    const existing = await db.execute('SELECT id FROM posts WHERE id = ?', [id])
    if (!existing.rows[0]) return cors({ error: 'Post not found' }, 404)

    await db.execute('DELETE FROM posts WHERE id = ?', [id])
    return cors({ success: true, id })
  } catch (e) {
    return cors({ error: e.message }, 500)
  }
}
