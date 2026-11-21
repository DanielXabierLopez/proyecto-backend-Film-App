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

/**
 * Datos públicos de un usuario por su id (sin password_hash ni google_id).
 * Lo usan GET /api/user y la vista /profile.
 *
 * @param {number} id
 * @returns {Promise<{id: number, name: string, email: string, role: string, created_at: Date}|null>}
 */
const findById = async (id) => {
  const query = `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

/**
 * Edita el nombre y el email de un usuario (PUT /api/user).
 * Solo esos dos campos: nunca el rol, el id ni la contraseña.
 * Si el email ya lo usa otro usuario, Postgres lanza el error 23505
 * (índice único ux_users_email, ver docs/schema.sql).
 *
 * @param {number} id
 * @param {{name: string, email: string}} data
 * @returns {Promise<{id: number, name: string, email: string, role: string, created_at: Date}|null>}
 *   El usuario editado, o null si no existe.
 */
const updateUser = async (id, { name, email }) => {
  const query = `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING id, name, email, role, created_at
  `;
  const { rows } = await pool.query(query, [name, email, id]);
  return rows[0] || null;
};

module.exports = {
  findByEmail,
  findByGoogleId,
  findById,
  findOrCreateGoogleUser,
  createUser,
  updateUser,
};
