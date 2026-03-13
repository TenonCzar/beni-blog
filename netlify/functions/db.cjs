const { createClient } = require('@libsql/client')

let client = null

async function getClient() {
  if (client) return client

  if (!process.env.TURSO_URL) {
    throw new Error('TURSO_URL environment variable is not set')
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is not set')
  }

  client = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  })

  await client.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL UNIQUE,
      excerpt      TEXT DEFAULT '',
      content      TEXT DEFAULT '',
      cover_image  TEXT DEFAULT '',
      author       TEXT NOT NULL DEFAULT 'Editor',
      status       TEXT NOT NULL DEFAULT 'draft',
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `, [])

  return client
}

module.exports = { getClient }
