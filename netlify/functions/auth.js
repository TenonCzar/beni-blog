// netlify/functions/auth.js
// Simple token-based auth helper

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'maison2024'
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'maison-secret-dev-only'

function generateToken(username) {
  // Simple base64 token — for production use a proper JWT library
  const payload = JSON.stringify({ username, ts: Date.now() })
  return Buffer.from(`${TOKEN_SECRET}:${payload}`).toString('base64')
}

function verifyToken(token) {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    if (!decoded.startsWith(TOKEN_SECRET + ':')) return false
    const payload = JSON.parse(decoded.slice(TOKEN_SECRET.length + 1))
    // Token expires after 24 hours
    if (Date.now() - payload.ts > 86400000) return false
    return true
  } catch {
    return false
  }
}

function extractToken(event) {
  const auth = event.headers?.authorization || ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : null
}

function requireAuth(event) {
  const token = extractToken(event)
  return verifyToken(token)
}

function cors(body, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify(body)
  }
}

module.exports = { ADMIN_USER, ADMIN_PASS, generateToken, requireAuth, cors }
