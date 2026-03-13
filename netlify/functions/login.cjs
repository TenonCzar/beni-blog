const { ADMIN_USER, ADMIN_PASS, generateToken, cors } = require('./auth.cjs')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({})

  if (event.httpMethod !== 'POST') return cors({ error: 'Method not allowed' }, 405)

  try {
    const { username, password } = JSON.parse(event.body || '{}')

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = generateToken(username)
      return cors({ token, username })
    }

    return cors({ error: 'Invalid credentials' }, 401)
  } catch {
    return cors({ error: 'Bad request' }, 400)
  }
}
