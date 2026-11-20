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

const findByGoogleId = async (googleId) => {
  const query = `
    SELECT id, name, email, password_hash, google_id, role, created_at
    FROM users
    WHERE google_id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [googleId]);
  return rows[0] || null;
};

const findOrCreateGoogleUser = async ({ googleId, email, name }) => {
  const existingByGoogleId = await findByGoogleId(googleId);
  if (existingByGoogleId) {
    return existingByGoogleId;
  }

  const existingByEmail = await findByEmail(email);
  if (existingByEmail) {
    const updateQuery = `
      UPDATE users
      SET google_id = $1
      WHERE id = $2
      RETURNING id, name, email, password_hash, google_id, role, created_at
    `;
    const { rows } = await pool.query(updateQuery, [googleId, existingByEmail.id]);
    return rows[0];
  }

  const insertQuery = `
    INSERT INTO users (name, email, password_hash, google_id, role)
    VALUES ($1, $2, NULL, $3, 'user')
    RETURNING id, name, email, password_hash, google_id, role, created_at
  `;
  const { rows } = await pool.query(insertQuery, [
    name || email.split('@')[0],
    email,
    googleId,
  ]);
  return rows[0];
};

const createUser = async ({ name, email, passwordHash, role = 'user' }) => {
  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, password_hash, google_id, role, created_at
  `;
  const { rows } = await pool.query(query, [name, email, passwordHash, role]);
  return rows[0];
};

module.exports = {
  findByEmail,
  findByGoogleId,
  findOrCreateGoogleUser,
  createUser,
};
