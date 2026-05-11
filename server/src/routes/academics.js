import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// Courses
router.get('/courses', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.query('SELECT * FROM courses ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const db = getDb();
    const { name, code, credits, semester, color } = req.body;
    const result = await db.execute(
      'INSERT INTO courses (name, code, credits, semester, color) VALUES (?, ?, ?, ?, ?)',
      [name, code, credits || 3, semester, color || '#6366f1']
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const db = getDb();
    await db.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assignments
router.get('/assignments', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.query(
      `SELECT a.*, c.name as course_name, c.color as course_color 
       FROM assignments a JOIN courses c ON a.course_id = c.id ORDER BY a.due_date`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const db = getDb();
    const { course_id, name, due_date, weight, score, max_score, status } = req.body;
    const result = await db.execute(
      `INSERT INTO assignments (course_id, name, due_date, weight, score, max_score, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course_id, name, due_date, weight || 0, score || null, max_score || 100, status || 'pending']
    );
    res.json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/assignments/:id', async (req, res) => {
  try {
    const db = getDb();
    const { score, status } = req.body;
    await db.execute('UPDATE assignments SET score = ?, status = ? WHERE id = ?', [score, status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/assignments/:id', async (req, res) => {
  try {
    const db = getDb();
    await db.execute('DELETE FROM assignments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/grades', async (req, res) => {
  try {
    const db = getDb();
    const courses = await db.query('SELECT * FROM courses');
    const assignments = await db.query('SELECT * FROM assignments WHERE score IS NOT NULL');
    
    const courseGrades = courses.map(course => {
      const courseAssignments = assignments.filter(a => a.course_id === course.id);
      const totalWeight = courseAssignments.reduce((sum, a) => sum + (a.weight || 0), 0);
      const weightedScore = courseAssignments.reduce((sum, a) => {
        const pct = a.max_score ? (a.score / a.max_score) * 100 : 0;
        return sum + (pct * (a.weight || 0) / 100);
      }, 0);
      const currentGrade = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
      return { ...course, currentGrade: currentGrade.toFixed(1), totalWeight };
    });
    
    const overallGPA = courseGrades.length > 0
      ? (courseGrades.reduce((sum, c) => sum + parseFloat(c.currentGrade), 0) / courseGrades.length).toFixed(1)
      : 0;
    
    res.json({ courses: courseGrades, overallGPA });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
