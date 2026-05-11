# Deploy to Render (Complete Guide)

## No SQL Installation Needed

SQLite is **embedded** — it runs inside Node.js via the `sqlite3` npm package (already installed). No separate database server required.

---

## Step 1: Sign Up on Render

1. Go to [render.com](https://render.com)
2. Click **Sign Up** → **Sign up with GitHub**
3. Authorize Render to access your repos

---

## Step 2: Create Web Service (Backend)

1. On Dashboard, click **New +** → **Web Service**
2. Select your repo: `Hansika-09/student_entreprenure_dashboard`
3. Click **Connect**

**Configure:**

| Setting | Value |
|---------|-------|
| Name | `student-dashboard-api` |
| Root Directory | `server` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |

**Environment Variables:**

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |

Click **Create Web Service**.

---

## Step 3: Get Your Backend URL

After 2-3 minutes, you'll get a URL like:
```
https://student-dashboard-api.onrender.com
```

Test it:
```
https://student-dashboard-api.onrender.com/api/health
```
Should return: `{"status":"ok","db":"sqlite"}`

---

## Step 4: Connect Frontend to Live Backend

Update `client/src/App.jsx` to point to your Render API:

```jsx
// Add this at the top
const API_BASE = 'https://student-dashboard-api.onrender.com';
// Or for local dev, use: const API_BASE = '';

// Then in each fetch call, prepend API_BASE
// e.g. fetch(`${API_BASE}/api/revenue/entries`)
```

**Better approach:** Create a config file.

Create `client/src/config.js`:
```js
export const API_BASE = import.meta.env.PROD
  ? 'https://student-dashboard-api.onrender.com'
  : '';
```

Then update all fetch calls to use `` `${API_BASE}/api/...` ``.

---

## Step 5: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `client`
4. Framework: **Vite** (auto-detected)
5. Deploy

Your frontend URL will be: `https://student-entreprenure-dashboard.vercel.app`

---

## Architecture After Deploy

```
User Browser
     |
     v
[Vercel] Frontend (React) --API calls--> [Render] Backend (Express + SQLite)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Render | Check that `server/package.json` has `"start": "node src/index.js"` |
| Frontend can't reach API | Add CORS config on backend; check API_BASE URL is correct |
| SQLite data resets | Normal on free tier sleep. Data persists between requests while awake. |
| 404 on page refresh (Vercel) | Add `vercel.json` with SPA rewrite rule (already added) |

---

## Free Tier Limits (Render)

- Web Service sleeps after 15 min of inactivity (cold start ~30 sec)
- SQLite file lives on disk but resets on every new deploy
- Perfect for demo/assignment use
