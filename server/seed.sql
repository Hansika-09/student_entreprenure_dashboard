-- ============================================================
-- DUMMY / FALSE DATABASE — Student Entrepreneur Dashboard
-- Run this to create tables and seed with sample data.
-- On Vercel, this SQL runs automatically in-memory on deploy.
-- ============================================================

-- Revenue entries table
CREATE TABLE IF NOT EXISTS revenue_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income','expense')),
  category TEXT,
  entry_date TEXT NOT NULL,
  recurring INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  semester TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  due_date TEXT,
  weight REAL DEFAULT 0,
  score REAL,
  max_score REAL DEFAULT 100,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT INTO revenue_entries (description, amount, type, category, entry_date, recurring) VALUES
 ('Startup Grant', 5000, 'income', 'Grant', date('now', '-30 days'), 0),
 ('Freelance Project', 1200, 'income', 'Services', date('now', '-20 days'), 0),
 ('Server Costs', -150, 'expense', 'Infrastructure', date('now', '-15 days'), 1),
 ('Domain Renewal', -25, 'expense', 'Infrastructure', date('now', '-10 days'), 1),
 ('Consulting Fee', 800, 'income', 'Services', date('now', '-5 days'), 0);

INSERT INTO courses (name, code, credits, semester, color) VALUES
 ('Data Structures', 'CS201', 4, 'Spring 2024', '#818cf8'),
 ('Entrepreneurship', 'BUS301', 3, 'Spring 2024', '#34d399'),
 ('Machine Learning', 'CS405', 4, 'Spring 2024', '#f472b6');

INSERT INTO assignments (course_id, name, due_date, weight, score, max_score, status) VALUES
 (1, 'Hash Table Implementation', date('now', '+5 days'), 15, null, 100, 'pending'),
 (1, 'Binary Search Tree', date('now', '-10 days'), 15, 92, 100, 'completed'),
 (2, 'Business Model Canvas', date('now', '+3 days'), 20, null, 100, 'pending'),
 (2, 'Pitch Deck', date('now', '-5 days'), 25, 88, 100, 'completed'),
 (3, 'Neural Network Lab', date('now', '+7 days'), 10, null, 100, 'pending');
