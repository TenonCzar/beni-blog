# MAISON — Fashion Editorial Blog

A minimal, clean fashion blog built with **Vue 3 + Vite**, **Netlify Functions**, and **Turso (libSQL)** database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 (Composition API) + Vite |
| Styling | Tailwind CSS |
| Routing | Vue Router 4 |
| Backend | Netlify Functions (serverless) |
| Database | Turso (libSQL / SQLite-compatible) |
| Auth | Token-based (sessionStorage) |
| Fonts | Cormorant Garamond + DM Sans |

---

## Project Structure

```
fashion-blog/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
├── .env.example
│
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── assets/
│   │   └── main.css
│   ├── composables/
│   │   ├── useApi.js         # API calls to Netlify Functions
│   │   └── useAuth.js        # Auth state management
│   ├── router/
│   │   └── index.js
│   ├── layouts/
│   │   ├── PublicLayout.vue
│   │   └── AdminLayout.vue
│   ├── components/
│   │   ├── SiteHeader.vue
│   │   ├── SiteFooter.vue
│   │   ├── PostCard.vue
│   │   └── LoadingSpinner.vue
│   └── pages/
│       ├── HomePage.vue
│       ├── BlogPage.vue
│       ├── PostPage.vue
│       ├── AboutPage.vue
│       └── admin/
│           ├── AdminLogin.vue
│           ├── AdminDashboard.vue
│           └── AdminPostEditor.vue
│
└── netlify/
    └── functions/
        ├── auth.js           # Auth helpers (shared)
        ├── db.js             # Database client (shared)
        ├── login.js          → POST /login
        ├── getPosts.js       → GET  /getPosts
        ├── getPost.js        → GET  /getPost?slug=x
        ├── createPost.js     → POST /createPost
        ├── updatePost.js     → PUT  /updatePost?id=x
        └── deletePost.js     → DELETE /deletePost?id=x
```

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  slug         TEXT    NOT NULL UNIQUE,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  author       TEXT    NOT NULL DEFAULT 'Editor',
  status       TEXT    NOT NULL DEFAULT 'draft',  -- 'draft' | 'published'
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run locally (with Netlify Dev)

```bash
netlify dev
```

The site will be available at `http://localhost:8888`

> **Note:** Without a Turso URL, the app uses an **in-memory store** — data resets on restart. This is fine for local testing.

---

## Setting Up Turso (Production Database)

1. Create a free account at [turso.tech](https://turso.tech)
2. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
3. Create a database:
   ```bash
   turso db create maison-blog
   turso db show maison-blog
   # Note the URL shown
   turso db tokens create maison-blog
   # Note the auth token shown
   ```
4. Add these to your Netlify environment variables (see below)

The schema is created automatically on first request.

---

## Deploying to Netlify

### Option A: Deploy via Netlify CLI

```bash
# Login to Netlify
netlify login

# Link or create a new site
netlify init

# Set environment variables
netlify env:set ADMIN_USERNAME admin
netlify env:set ADMIN_PASSWORD your-secure-password
netlify env:set TOKEN_SECRET your-random-secret-string
netlify env:set TURSO_URL libsql://your-db-name.turso.io
netlify env:set TURSO_AUTH_TOKEN your-turso-auth-token

# Deploy
netlify deploy --prod
```

### Option B: Deploy via Netlify Dashboard (GitHub)

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import from Git"
3. Select your repository
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Go to **Site Settings → Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your-secure-password` |
| `TOKEN_SECRET` | `long-random-string` |
| `TURSO_URL` | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | `your-token` |

6. Trigger a deploy

---

## Admin Panel

Access the admin panel at `/admin`

**Default credentials** (change via env vars before deploying):
- Username: `admin`
- Password: `maison2024`

### Admin Features
- ✅ Create new blog posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Publish or save as draft
- ✅ Markdown editor with toolbar
- ✅ Live preview mode
- ✅ Cover image (URL-based)

---

## Adding the `@libsql/client` Package

For production (Turso), install the client:

```bash
npm install @libsql/client
```

The `db.js` function dynamically imports it only when `TURSO_URL` is set, so local dev without Turso still works fine.

---

## Customization

### Change blog name
Search for `Maison` across all `.vue` files and replace with your blog name.

### Change color
The orange accent is `#FF6A00`. Update in:
- `tailwind.config.js` → `colors.orange`
- Any hardcoded `text-[#FF6A00]` / `border-[#FF6A00]` in components

### Add categories/tags
Add a `tags TEXT` column to the schema and update the forms + API functions.

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home (featured + recent posts) |
| `/blog` | Blog listing (all published posts) |
| `/blog/:slug` | Single post |
| `/about` | About page |
| `/admin` | Admin login |
| `/admin/dashboard` | Post management |
| `/admin/posts/new` | New post editor |
| `/admin/posts/:id/edit` | Edit post editor |
