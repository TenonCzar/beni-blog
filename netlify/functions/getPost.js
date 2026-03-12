const { cors } = require('./auth')
const { getClient } = require('./db')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  try {
    const db = await getClient()
    const { slug, id } = event.queryStringParameters || {}

    let result
    if (id) {
      result = await db.execute('SELECT * FROM posts WHERE id = ?', [id])
    } else if (slug) {
      result = await db.execute('SELECT * FROM posts WHERE slug = ?', [slug])
    } else {
      return cors({ error: 'slug or id required' }, 400)
    }

    const post = result.rows[0] || null
    if (!post) return cors({ error: 'Post not found' }, 404)

    return cors({ post })
  } catch (e) {
    return cors({ error: e.message }, 500)
  }
}
