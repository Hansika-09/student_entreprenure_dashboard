# Student Entrepreneur Dashboard

A full-stack dashboard web application for student entrepreneurs to manage startup revenue and academic grades.

## Features

- **Revenue Management**: Track income, expenses, and view net revenue with visual analytics
- **Academic Management**: Manage courses, assignments, and track grades/GPA
- **Dark Mode UI**: Modern, sleek dark interface optimized for productivity
- **SQLite Database**: Lightweight embedded SQL database (no setup required)
- **Responsive Design**: Works across desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Recharts
- **Backend**: Node.js + Express
- **Database**: SQLite (embedded, no setup required)

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Run Development Server

No database setup needed — SQLite creates itself automatically.

```bash
npm run dev
```

This starts both the backend API (`http://localhost:3001`) and the React dev server (`http://localhost:5173`).

## Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Update vite.config.js for GitHub Pages

In `client/vite.config.js`, set the `base` to your repository name:

```js
const base = '/YOUR_REPO_NAME/'
```

For a user site (username.github.io), leave it as `/`.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Build and deployment**, select **GitHub Actions**
4. The included workflow (`.github/workflows/deploy.yml`) will auto-deploy on every push to `main`

### Step 4: Deploy the Backend (Required for full functionality)

GitHub Pages only hosts static files. The Express API needs separate hosting:

- **Render** (Recommended): Free Node.js hosting
  1. Create a new Web Service on [render.com](https://render.com)
  2. Connect your GitHub repo
  3. Set root directory to `server`
  4. Set build/start command to `npm start`
  5. Add environment variables from `server/.env`

- **Oracle Cloud Free Tier**: Run both your Oracle DB and Node.js backend on a free VM

- **Railway / Fly.io**: Alternative free tiers for Node.js apps

Once your backend is live, update the API base URL in `client/src/App.jsx` or use environment variables.

### Note on SQLite in Production

SQLite works well for small to medium loads. The database file (`data.db`) is created automatically in the server folder. If you deploy to a platform with ephemeral filesystem (like Heroku or some serverless platforms), data may reset on each restart. For persistent hosting, use Render, Railway, or a VPS.

## Database Schema

### Revenue Entries
- `id`, `description`, `amount`, `type` (income/expense), `category`, `entry_date`, `recurring`

### Courses
- `id`, `name`, `code`, `credits`, `semester`, `color`

### Assignments
- `id`, `course_id`, `name`, `due_date`, `weight`, `score`, `max_score`, `status`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/revenue/entries` | GET, POST | List / create revenue entries |
| `/api/revenue/summary` | GET | Revenue summary stats |
| `/api/revenue/entries/:id` | DELETE | Delete entry |
| `/api/academics/courses` | GET, POST | List / create courses |
| `/api/academics/courses/:id` | DELETE | Delete course |
| `/api/academics/assignments` | GET, POST | List / create assignments |
| `/api/academics/assignments/:id` | PATCH, DELETE | Update / delete assignment |
| `/api/academics/grades` | GET | Grade summary |

## License

MIT
