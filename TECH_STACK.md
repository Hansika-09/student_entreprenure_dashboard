# Student Entrepreneur Dashboard — Technical Documentation

## 1. Project Overview

| | |
|---|---|
| **Project Name** | Student Entrepreneur Dashboard |
| **Type** | Full-Stack Web Application |
| **Purpose** | Help student entrepreneurs manage startup revenue schedules and academic grades in one unified dashboard |
| **UI Theme** | Dark Mode |
| **Repository** | [github.com/Hansika-09/student_entreprenure_dashboard](https://github.com/Hansika-09/student_entreprenure_dashboard) |
| **Live URL** | Deployed on Vercel |

---

## 2. Architecture

```
┌─────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│   User Browser  │────▶│   Vercel (Serverless)│────▶│ In-Memory SQLite │
│                 │◀────│   Express + React    │◀────│   (Embedded DB)  │
└─────────────────┘     └────────────────────┘     └──────────────────┘
```

- **Frontend**: React SPA built with Vite, served statically
- **Backend**: Express.js API running as a Vercel serverless function
- **Database**: SQLite (embedded, no external server required)
- **Deployment**: Vercel (full-stack, single platform)

---

## 3. Tech Stack by Layer

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library for building interactive components |
| **Vite** | 5.x | Build tool and dev server with fast HMR |
| **TailwindCSS** | 3.x | Utility-first CSS framework for rapid dark-mode styling |
| **PostCSS** | 8.x | CSS processing pipeline (Tailwind + Autoprefixer) |
| **Recharts** | 2.x | Data visualization library for revenue and grade charts |
| **Lucide React** | 0.x | Icon library (trending arrows, calendar, book, etc.) |
| **React Router DOM** | 6.x | Client-side routing for Dashboard, Revenue, Academics pages |

### 3.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.18.x | Web framework for REST API routes |
| **CORS** | 2.8.x | Cross-Origin Resource Sharing middleware |
| **Dotenv** | 16.4.x | Environment variable management |
| **date-fns** | 3.3.x | Date utility functions |
| **serverless-http** | 3.2.x | Wraps Express app for serverless deployment on Vercel |

### 3.3 Database

| Technology | Purpose |
|------------|---------|
| **SQLite3** | Embedded SQL database — file-based for local dev, in-memory (`:memory:`) on Vercel |

**Why SQLite?**
- Zero configuration — no separate database server to install or manage
- Self-contained single file (`data.db`) for local development
- Works as an in-memory database on Vercel's read-only filesystem
- Perfect for small-to-medium workloads and demo applications

---

## 4. Database Schema

### 4.1 Revenue Entries

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `description` | TEXT | NOT NULL |
| `amount` | REAL | NOT NULL |
| `type` | TEXT | NOT NULL, CHECK('income','expense') |
| `category` | TEXT | — |
| `entry_date` | TEXT | NOT NULL |
| `recurring` | INTEGER | DEFAULT 0 |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

### 4.2 Courses

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `name` | TEXT | NOT NULL |
| `code` | TEXT | NOT NULL |
| `credits` | INTEGER | NOT NULL, DEFAULT 3 |
| `semester` | TEXT | — |
| `color` | TEXT | DEFAULT '#6366f1' |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

### 4.3 Assignments

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `course_id` | INTEGER | NOT NULL, FOREIGN KEY → courses(id) |
| `name` | TEXT | NOT NULL |
| `due_date` | TEXT | — |
| `weight` | REAL | DEFAULT 0 |
| `score` | REAL | — |
| `max_score` | REAL | DEFAULT 100 |
| `status` | TEXT | DEFAULT 'pending' |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

## 5. REST API Endpoints

### Revenue

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/revenue/entries` | List all revenue entries |
| POST | `/api/revenue/entries` | Create a new revenue entry |
| DELETE | `/api/revenue/entries/:id` | Delete a revenue entry |
| GET | `/api/revenue/summary` | Get income, expenses, net, monthly breakdown |

### Academics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academics/courses` | List all courses |
| POST | `/api/academics/courses` | Create a new course |
| DELETE | `/api/academics/courses/:id` | Delete a course |
| GET | `/api/academics/assignments` | List all assignments with course info |
| POST | `/api/academics/assignments` | Create a new assignment |
| PATCH | `/api/academics/assignments/:id` | Update assignment score/status |
| DELETE | `/api/academics/assignments/:id` | Delete an assignment |
| GET | `/api/academics/grades` | Calculate course grades and overall GPA |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Returns `{ status: 'ok', db: 'sqlite' }` |

---

## 6. Project Structure

```
student_entreprenure_dashboard/
├── api/
│   └── index.mjs                    # Vercel serverless function entry point
├── client/
│   ├── dist/                      # Production build output
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx         # Sidebar + main content layout
│   │   ├── lib/
│   │   │   ├── utils.js           # Tailwind class merging (cn helper)
│   │   │   └── api.js             # API fetch helpers (same-origin)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Overview + charts
│   │   │   ├── Revenue.jsx        # Income/expense tracker
│   │   │   └── Academics.jsx      # Courses + assignments + GPA
│   │   ├── App.jsx                # React Router setup
│   │   ├── index.css              # Tailwind directives + custom styles
│   │   └── main.jsx               # React app entry point
│   ├── index.html
│   ├── package.json               # Frontend deps (React, Vite, Tailwind, Recharts)
│   ├── tailwind.config.js         # Dark mode, custom colors
│   ├── postcss.config.js
│   └── vite.config.js             # Vite config with dev proxy
├── server/
│   ├── seed.sql                   # Dummy SQL — table creation + sample data
│   └── src/
│       ├── db.js                  # SQLite connection, schema, seeding
│       ├── index.js               # Express app setup + route mounting
│       └── routes/
│           ├── revenue.js           # Revenue CRUD routes
│           └── academics.js         # Academics CRUD routes
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions for GitHub Pages
├── .gitignore
├── package.json                   # Root — concurrent dev scripts, server deps
├── vercel.json                    # Vercel routing + build config
├── netlify.toml                   # Netlify SPA redirect config
├── README.md
├── RENDER_DEPLOY_GUIDE.md
├── TECH_STACK.md                  # This file
└── LICENSE                        # MIT
```

---

## 7. Key Design Decisions

### From Oracle DBMS → SQLite

Initially planned with Oracle DBMS for production, switched to SQLite for:
- **Simplicity**: No database server installation, configuration, or credentials
- **Portability**: Single file database that travels with the project
- **Cost**: Free, no cloud database required
- **Vercel compatibility**: Works as in-memory database on serverless platforms

### Vercel Full-Stack Deployment

Instead of separate frontend (Vercel) + backend (Render) deployment:
- **Single platform**: Frontend static files + serverless API on Vercel
- **Same origin**: No CORS issues, simpler API configuration
- **In-memory SQLite**: Database resets with sample data on each deploy — ideal for demos

### Dark Mode UI

- TailwindCSS `dark` class strategy with custom color palette
- Emerald for income, red for expenses, amber for GPA, indigo for primary actions
- Lucide icons throughout for a clean, modern look

---

## 8. Local Development

```bash
# Install all dependencies (root, client, server)
npm run install:all

# Start both frontend (localhost:5173) and backend (localhost:3001)
npm run dev

# Or start individually:
npm run dev:client   # Vite dev server
npm run dev:server   # Node.js watch mode
```

**No database setup required** — SQLite creates `data.db` automatically and seeds sample data on first run.

---

## 9. Deployment

### Vercel (Current)

1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Framework: Vite (auto-detected)
3. Build command: `cd client && npm install && npm run build`
4. Output directory: `client/dist`
5. Add environment variable: `VERCEL = 1`
6. Deploy

### Alternative: Render (Backend) + Vercel (Frontend)

See `RENDER_DEPLOY_GUIDE.md` for detailed Render deployment steps with persistent file-based SQLite.

---

## 10. License

MIT License — see `LICENSE` file.
