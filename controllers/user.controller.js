/**
 * Controlador del perfil del usuario con la sesión iniciada (usuario o admin).
 * GET /api/user y PUT /api/user trabajan SIEMPRE con `req.user.id`, que sale del
 * token (middlewares/auth.middleware.js): nunca de la URL ni del body, así nadie
 * puede leer ni editar el perfil de otro.
 */

const userModel = require('../models/user.model');
const { createSession } = require('../services/session.service');

// Mismo límite que la columna `name VARCHAR(100)` de docs/schema.sql
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 255;
// Validación sencilla: algo@algo.algo, sin espacios
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida y limpia el nombre y el email del body.
 *
 * @param {Object} body
 * @returns {{data: {name: string, email: string}, errors: string[]}}
 */
const validateProfile = (body = {}) => {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!name) {
    errors.push('El nombre es obligatorio');
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.push(`El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`);
  }

  if (!email) {
    errors.push('El email es obligatorio');
  } else if (email.length > EMAIL_MAX_LENGTH || !EMAIL_REGEX.test(email)) {
    errors.push('El email no es válido');
  }

  return { data: { name, email }, errors };
};

/**
 * GET /api/user
 * Datos del usuario con la sesión iniciada, leídos de la base de datos
 * (no del token, que puede tener datos antiguos).
 */
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    // El token es válido pero el usuario ya no existe (p. ej. lo borró un admin)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Error en GET /api/user:', err);
    return res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

/**
 * PUT /api/user
 * Edita el nombre y el email del usuario con la sesión iniciada.
 * El body solo puede cambiar `name` y `email`: si llegan `role` o `id`, se ignoran.
 * Al terminar renueva el token, para que el menú y el saludo muestren ya los datos nuevos.
 */
const updateUser = async (req, res) => {
  const { data, errors } = validateProfile(req.body);

  if (errors.length) {
    return res.status(400).json({ message: 'Datos no válidos', errors });
  }

  try {
    const user = await userModel.updateUser(req.user.id, data);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    createSession(res, user);

    return res.status(200).json({ message: 'Perfil actualizado', user });
  } catch (err) {
    // 23505: el email ya lo usa otro usuario (índice único ux_users_email)
    if (err && err.code === '23505') {
      return res.status(400).json({
        message: 'Datos no válidos',
        errors: ['Ese email ya está registrado'],
      });
    }

    console.error('Error en PUT /api/user:', err);
    return res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

module.exports = {
  validateProfile,
  getUser,
  updateUser,
};
