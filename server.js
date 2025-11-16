// server.js
import express from 'express';
import cors from 'cors';
import { pool, setCurrentUser } from './db.js';
import { checkJwt } from './auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Middleware ----------------

// Set current Auth0 user for Row-Level Security
async function setUser(req, res, next) {
  try {
    const auth0UserId = req.user.sub; // JWT 'sub' claim
    await setCurrentUser(auth0UserId);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

// ---------------- Contents Endpoints ----------------

// GET all contents
app.get('/api/contents', checkJwt, setUser, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, totem_id, category, title, artist, snippet, created_at
      FROM public.contents
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE content by id (admin-only enforced by RLS)
app.delete('/api/contents/:id', checkJwt, setUser, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      DELETE FROM public.contents
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Not authorized or content does not exist' });
    }

    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------- Profiles Endpoints ----------------

// GET all profiles
app.get('/api/profiles', checkJwt, setUser, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, display_name, is_artist, created_at
      FROM public.profiles
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE profile by id (admin-only enforced by RLS)
app.delete('/api/profiles/:id', checkJwt, setUser, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      DELETE FROM public.profiles
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Not authorized or profile does not exist' });
    }

    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
