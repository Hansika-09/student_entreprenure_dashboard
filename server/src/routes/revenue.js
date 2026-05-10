import { Router } from 'express';
import { getDb, getDbMode } from '../db.js';

const router = Router();

router.get('/entries', async (req, res) => {
  try {
    const db = getDb();
    const isOracle = getDbMode() === 'oracle';
    const sql = isOracle
      ? `SELECT id, description, amount, type, category, 
                TO_CHAR(entry_date, 'YYYY-MM-DD') as entry_date, 
                recurring, created_at FROM revenue_entries ORDER BY entry_date DESC`
      : `SELECT * FROM revenue_entries ORDER BY entry_date DESC`;
    const rows = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/entries', async (req, res) => {
  try {
    const db = getDb();
    const { description, amount, type, category, entry_date, recurring } = req.body;
    const isOracle = getDbMode() === 'oracle';
    const sql = isOracle
      ? `INSERT INTO revenue_entries (description, amount, type, category, entry_date, recurring) 
         VALUES (:1, :2, :3, :4, TO_DATE(:5, 'YYYY-MM-DD'), :6) RETURNING id INTO :7`
      : `INSERT INTO revenue_entries (description, amount, type, category, entry_date, recurring) 
         VALUES (?, ?, ?, ?, ?, ?)`;
    
    const params = [description, amount, type, category || null, entry_date, recurring ? 1 : 0];
    const result = await db.execute(sql, isOracle ? [...params, { dir: require('oracledb').BIND_OUT }] : params);
    res.json({ id: isOracle ? result.outBinds[0][0] : result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/entries/:id', async (req, res) => {
  try {
    const db = getDb();
    const isOracle = getDbMode() === 'oracle';
    const sql = isOracle
      ? 'DELETE FROM revenue_entries WHERE id = :1'
      : 'DELETE FROM revenue_entries WHERE id = ?';
    await db.execute(sql, [req.params.id]);
    if (isOracle) await db.commit();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const db = getDb();
    const isOracle = getDbMode() === 'oracle';
    const entries = await db.query(isOracle
      ? `SELECT type, SUM(amount) as total FROM revenue_entries GROUP BY type`
      : `SELECT type, SUM(amount) as total FROM revenue_entries GROUP BY type`
    );
    
    const income = entries.find(e => e.type === 'income')?.total || 0;
    const expenses = Math.abs(entries.find(e => e.type === 'expense')?.total || 0);
    const net = income - expenses;
    
    const byMonth = await db.query(isOracle
      ? `SELECT TO_CHAR(entry_date, 'YYYY-MM') as month, type, SUM(amount) as total 
         FROM revenue_entries GROUP BY TO_CHAR(entry_date, 'YYYY-MM'), type ORDER BY month`
      : `SELECT strftime('%Y-%m', entry_date) as month, type, SUM(amount) as total 
         FROM revenue_entries GROUP BY month, type ORDER BY month`
    );
    
    res.json({ income, expenses, net, byMonth });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
