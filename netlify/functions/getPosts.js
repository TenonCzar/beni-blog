const { cors } = require('./auth')
const { getClient } = require('./db')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  try {
    const db = await getClient()
    const status = event.queryStringParameters?.status

    let result
    if (status) {
      result = await db.execute('SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC', [status])
    } else {
      result = await db.execute('SELECT * FROM posts ORDER BY created_at DESC', [])
    }

    return cors({ posts: result.rows })
  } catch (e) {
    return cors({ error: e.message }, 500)
  }
}
