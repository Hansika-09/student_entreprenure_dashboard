import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/entries', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.query('SELECT * FROM revenue_entries ORDER BY entry_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/entries', async (req, res) => {
  try {
    const db = getDb();
    const { description, amount, type, category, entry_date, recurring } = req.body;
    const sql = `INSERT INTO revenue_entries (description, amount, type, category, entry_date, recurring) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [description, amount, type, category || null, entry_date, recurring ? 1 : 0];
    const result = await db.execute(sql, params);
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/entries/:id', async (req, res) => {
  try {
    const db = getDb();
    await db.execute('DELETE FROM revenue_entries WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const db = getDb();
    const entries = await db.query('SELECT type, SUM(amount) as total FROM revenue_entries GROUP BY type');
    
    const income = entries.find(e => e.type === 'income')?.total || 0;
    const expenses = Math.abs(entries.find(e => e.type === 'expense')?.total || 0);
    const net = income - expenses;
    
    const byMonth = await db.query(
      `SELECT strftime('%Y-%m', entry_date) as month, type, SUM(amount) as total 
       FROM revenue_entries GROUP BY month, type ORDER BY month`
    );
    
    res.json({ income, expenses, net, byMonth });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
