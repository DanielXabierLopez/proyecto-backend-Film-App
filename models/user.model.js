const db = require('../config/sqlDB');
const pool = db.pool || db;

const findByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password_hash, google_id, role, created_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};

module.exports = {
  findByEmail,
};