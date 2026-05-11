# Gamma AI Presentation Prompt

Copy and paste the entire block below into Gamma AI (gamma.app) to generate your project presentation.

---

## PROMPT (Copy Everything Below This Line)

Create a professional 12-15 slide presentation for a full-stack web development project called **"Student Entrepreneur Dashboard"**. Use a dark, modern tech aesthetic with purple/indigo accent colors. Each slide should have clean layouts with icons, short bullet points, and minimal text.

### Slide 1: Title Slide
- Title: "Student Entrepreneur Dashboard"
- Subtitle: "A Full-Stack Web Application for Managing Startup Revenue & Academic Performance"
- Author: Hansika
- Tech stack badges: React, Vite, TailwindCSS, Node.js, Express, SQLite
- Background: Dark gradient with subtle grid pattern

### Slide 2: The Problem
- Student entrepreneurs juggle two demanding worlds: running a startup AND maintaining academic grades
- Tracking startup income/expenses in spreadsheets is messy
- Academic assignments and GPA calculations are scattered across different tools
- No unified dashboard exists to view both finances and academics side-by-side
- Visual: Split screen illustration — laptop with code on one side, graduation cap on the other

### Slide 3: The Solution
- A single dark-mode dashboard that combines:
  - Revenue tracking (income, expenses, net profit, monthly trends)
  - Academic management (courses, assignments, GPA calculator)
  - Visual analytics with interactive charts
- Built specifically for student founders who need clarity, not complexity
- Visual: Dashboard mockup with revenue cards on left, grade chart on right

### Slide 4: Tech Stack Overview
Three-column layout:

**Frontend**
- React 18 + Vite (fast dev & build)
- TailwindCSS (dark mode utility styling)
- Recharts (data visualization)
- Lucide React (icons)
- React Router DOM (SPA navigation)

**Backend**
- Node.js + Express.js (REST API)
- CORS + Dotenv (middleware & config)
- serverless-http (Vercel deployment)

**Database**
- SQLite (embedded, zero-config SQL)
- File-based for local dev, in-memory for Vercel

### Slide 5: Database Schema
Show three table diagrams:

1. **revenue_entries** — id, description, amount, type (income/expense), category, entry_date, recurring
2. **courses** — id, name, code, credits, semester, color
3. **assignments** — id, course_id, name, due_date, weight, score, max_score, status

Note: SQLite handles everything — no external DB server needed.

### Slide 6: API Architecture
Diagram showing REST endpoints:

**Revenue API**
- GET /api/revenue/entries
- POST /api/revenue/entries
- DELETE /api/revenue/entries/:id
- GET /api/revenue/summary

**Academics API**
- GET /api/academics/courses
- POST /api/academics/courses
- GET /api/academics/assignments
- PATCH /api/academics/assignments/:id
- GET /api/academics/grades

All routes return JSON. Same-origin API calls on Vercel — no CORS issues.

### Slide 7: Key Features — Revenue Management
- Add income and expense entries with category tags
- View total income, expenses, and net revenue at a glance
- Monthly revenue breakdown bar chart
- Recurring expense flagging
- Delete entries with confirmation
- Visual: Screenshot-style mockup of revenue table with green income rows and red expense rows

### Slide 8: Key Features — Academics Management
- Create courses with custom colors
- Add assignments with due dates and weight percentages
- Toggle assignment status (pending/completed)
- Enter scores directly in the table — auto-calculates GPA
- Grade distribution area chart per course
- Visual: Course cards with color coding + assignment table with score inputs

### Slide 9: Dashboard Overview
- Four stat cards: Total Income, Total Expenses, Net Revenue, Current GPA
- Revenue overview bar chart (income vs expenses)
- Grade distribution area chart across all courses
- Upcoming deadlines list with course color indicators
- Visual: Full dashboard layout mockup

### Slide 10: UI/UX Design Choices
- **Dark Mode**: Reduces eye strain for long study/work sessions
- **Color Coding**: Emerald = income, Red = expenses, Amber = GPA, Indigo = primary actions
- **Lucide Icons**: Clean, consistent iconography throughout
- **Responsive**: Works on desktop and mobile
- **Minimal Forms**: Inline inputs, no modal overload

### Slide 11: Deployment Architecture
Diagram:

```
User Browser
    |
    v
[Vercel] — Static React Frontend (client/dist)
    |
    v
[Vercel Serverless Function] — Express API (api/index.mjs)
    |
    v
[SQLite :memory:] — In-Memory Database (resets with sample data on deploy)
```

Why Vercel full-stack?
- Single platform — no separate backend host
- Same origin — no CORS configuration needed
- In-memory SQLite — perfect for demo/data resets on each deploy
- Zero database setup — SQLite is embedded in Node.js

### Slide 12: Sample Data (Dummy Database)
Show the seeded data that appears on first load:

**Revenue**
- Startup Grant: +$5,000
- Freelance Project: +$1,200
- Server Costs: -$150
- Domain Renewal: -$25
- Consulting Fee: +$800

**Courses**
- Data Structures (CS201) — 4 credits
- Entrepreneurship (BUS301) — 3 credits
- Machine Learning (CS405) — 4 credits

**Assignments**
- Hash Table Implementation — pending, 15%
- Binary Search Tree — completed, 92/100
- Business Model Canvas — pending, 20%

### Slide 13: Development & Challenges
- Started with Oracle DBMS → switched to SQLite for simplicity and Vercel compatibility
- Built Express API with SQLite file DB locally, then adapted to in-memory for serverless
- Created reusable API helper (`api.js`) to handle same-origin and cross-origin fetching
- Deployed on Vercel using serverless-http wrapper for Express

### Slide 14: Live Demo / Links
- GitHub Repository: github.com/Hansika-09/student_entreprenure_dashboard
- Live App: [your-vercel-url]
- Tech Stack: React, Vite, TailwindCSS, Express, SQLite

QR code for GitHub repo (optional)

### Slide 15: Thank You / Q&A
- "Questions?"
- Contact: [your email or GitHub]
- Icons: GitHub, Vercel, React logos

---

## STYLE INSTRUCTIONS FOR GAMMA

- **Theme**: Dark mode with deep purple/indigo gradient backgrounds
- **Typography**: Clean sans-serif, bold headings, light body text
- **Accents**: #6366f1 (indigo), #34d399 (emerald), #f87171 (red), #fbbf24 (amber)
- **Icons**: Use Lucide-style icons or simple line icons for each section
- **Layouts**: Prefer cards, split screens, and 2-3 column grids
- **Data Visualization**: Include placeholder charts (bar, area, donut) where mentioned
- **Code snippets**: Show short SQL or API route snippets in monospace with syntax highlighting

---

## TIPS FOR USING THIS PROMPT

1. Go to [gamma.app](https://gamma.app)
2. Click "Create new AI" or "Create with AI"
3. Paste the entire prompt above
4. Gamma will generate a presentation outline — review and adjust
5. Choose the dark theme option
6. Generate slides and edit text/images as needed
7. Export as PDF or present directly from Gamma
