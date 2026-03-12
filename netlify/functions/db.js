// netlify/functions/db.js
// Uses @libsql/client (Turso) in production when TURSO_URL is set.
// Falls back to better-sqlite3 for local dev — real SQLite, persistent file.

const path = require("path");
const fs = require("fs");

let client = null;

async function getClient() {
  if (client) return client;

  if (process.env.TURSO_URL) {
    const { createClient } = require("@libsql/client");
    client = createClient({
      url: process.env.TURSO_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    await initSchema(client);
  } else {
    client = createSQLiteClient();
  }

  return client;
}

function createSQLiteClient() {
  const Database = require("better-sqlite3");
  const dbDir = path.join(__dirname, "../../.netlify");
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const db = new Database(path.join(dbDir, "dev.db"));

  db.exec(`
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
  `);

  return {
    async execute(sql, args = []) {
      const stmt = db.prepare(sql);
      const isSelect = sql.trim().toUpperCase().startsWith("SELECT");
      if (isSelect) {
        const rows = stmt.all(...args);
        return { rows };
      } else {
        const info = stmt.run(...args);
        return { rows: [], lastInsertRowid: info.lastInsertRowid };
      }
    },
  };
}

async function initSchema(client) {
  await client.execute(
    `
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
  `,
    [],
  );
}

module.exports = { getClient };
