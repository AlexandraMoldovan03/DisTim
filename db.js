// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

export async function setCurrentUser(auth0UserId) {
  await pool.query(`SELECT set_config('app.current_user_id', $1, true)`, [auth0UserId]);
}

export { pool };
