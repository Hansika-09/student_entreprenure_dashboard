import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function initDatabase() {
  if (db) return db;

  const dbPath = path.join(__dirname, '..', 'data.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('SQLite open error:', err);
    else console.log('Connected to SQLite database');
  });

  db.query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  db.execute = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };

  // Create tables
  const schema = `
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

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      credits INTEGER NOT NULL DEFAULT 3,
      semester TEXT,
      color TEXT DEFAULT '#6366f1',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

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
  `;

  for (const stmt of schema.split(';').filter(s => s.trim())) {
    await new Promise((resolve, reject) => {
      db.exec(stmt, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Insert sample data if empty
  const revenueCount = await db.query('SELECT COUNT(*) as count FROM revenue_entries');
  if (revenueCount[0].count === 0) {
    await db.execute(
      `INSERT INTO revenue_entries (description, amount, type, category, entry_date, recurring) VALUES
       ('Startup Grant', 5000, 'income', 'Grant', date('now', '-30 days'), 0),
       ('Freelance Project', 1200, 'income', 'Services', date('now', '-20 days'), 0),
       ('Server Costs', -150, 'expense', 'Infrastructure', date('now', '-15 days'), 1),
       ('Domain Renewal', -25, 'expense', 'Infrastructure', date('now', '-10 days'), 1),
       ('Consulting Fee', 800, 'income', 'Services', date('now', '-5 days'), 0)`
    );
  }

  const courseCount = await db.query('SELECT COUNT(*) as count FROM courses');
  if (courseCount[0].count === 0) {
    await db.execute(
      `INSERT INTO courses (name, code, credits, semester, color) VALUES
       ('Data Structures', 'CS201', 4, 'Spring 2024', '#818cf8'),
       ('Entrepreneurship', 'BUS301', 3, 'Spring 2024', '#34d399'),
       ('Machine Learning', 'CS405', 4, 'Spring 2024', '#f472b6')`
    );
    await db.execute(
      `INSERT INTO assignments (course_id, name, due_date, weight, score, max_score, status) VALUES
       (1, 'Hash Table Implementation', date('now', '+5 days'), 15, null, 100, 'pending'),
       (1, 'Binary Search Tree', date('now', '-10 days'), 15, 92, 100, 'completed'),
       (2, 'Business Model Canvas', date('now', '+3 days'), 20, null, 100, 'pending'),
       (2, 'Pitch Deck', date('now', '-5 days'), 25, 88, 100, 'completed'),
       (3, 'Neural Network Lab', date('now', '+7 days'), 10, null, 100, 'pending')`
    );
  }

  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function getDbMode() {
  return 'sqlite';
}
