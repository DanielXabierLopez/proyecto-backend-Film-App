const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const {
  getGoogleAuthUrl,
  exchangeCodeForTokens,
  getGoogleUserProfile,
} = require('../config/oauth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_cambiar_en_env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Página a la que se va después de iniciar sesión (README, "Formulario de acceso"):
 * el administrador a /movies (su única vista) y el usuario a /dashboard.
 *
 * @param {"user"|"admin"} role
 * @returns {string}
 */
const getRedirectByRole = (role) => {
  if (role === 'admin') return '/movies';
  return '/dashboard';
};

/**
 * Abre la sesión: firma el JWT y lo guarda en la cookie `token` (httpOnly).
 * La usan login, Google y signup, para que el token tenga siempre los mismos
 * datos: los que lee middlewares/auth.middleware.js para rellenar `req.user`.
 * Nunca incluye la contraseña.
 *
 * @param {Object} res Respuesta de Express.
 * @param {{id: number, email: string, name: string, role: string}} user
 * @returns {string} El token firmado.
 */
const createSession = (res, user) => {
  const token = jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};

/**
 * ¿La petición viene de JS/Postman con JSON (responder JSON)
 * o del formulario de la vista (responder con una vista o una redirección)?
 */
const wantsJson = (req) => Boolean(req.is('application/json'));

/**
 * Responde a un login fallido: JSON para la API, o vuelve a pintar
 * el formulario de login con el mensaje en `error` (la vista ya lo muestra).
 */
const loginError = (req, res, status, message) => {
  if (wantsJson(req)) {
    return res.status(status).json({ message });
  }
  return res.status(status).render('login', {
    title: 'Film App - Iniciar sesión',
    error: message,
  });
};

/**
 * POST /api/login
 * Valida email y contraseña, abre la sesión con JWT y redirige según el rol.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return loginError(req, res, 400, 'Email y contraseña obligatorios');
    }

    const user = await userModel.findByEmail(email.trim());

    // Mismo mensaje si no existe el email o si falla la contraseña:
    // así no se revela qué emails están registrados.
    // Sin password_hash = usuario que solo entra con Google.
    if (!user || !user.password_hash) {
      return loginError(req, res, 401, 'Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return loginError(req, res, 401, 'Credenciales inválidas');
    }

    const token = createSession(res, user);
    const redirectTo = getRedirectByRole(user.role);

    if (wantsJson(req)) {
      return res.status(200).json({
        message: 'Login correcto',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo,
        token,
      });
    }

    return res.redirect(redirectTo);
  } catch (err) {
    console.error('Error en login:', err);
    return loginError(req, res, 500, 'Error interno en el login');
  }
};

const googleAuth = (req, res) => {
  const url = getGoogleAuthUrl();
  return res.redirect(url);
};

const googleCallback = async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error || !code) {
      return res.status(400).render('login', {
        error: 'No se pudo completar el inicio de sesión con Google',
      });
    }

    const tokenData = await exchangeCodeForTokens(code);
    const profile = await getGoogleUserProfile(tokenData.access_token);

    const user = await userModel.findOrCreateGoogleUser({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
    });

    createSession(res, user);
    return res.redirect(getRedirectByRole(user.role));
  } catch (err) {
    console.error('Error en el Google OAuth callback:', err);
    return res.status(500).render('login', {
      error: 'Error al autenticar con Google',
    });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).render('signup', {
        error: 'Completa nombre, email y contraseña',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.createUser({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    });

    createSession(res, user);
    return res.redirect('/dashboard');
  } catch (err) {
    if (err && err.code === '23505') {
      return res.status(400).render('signup', {
        error: 'Ese email ya está registrado',
      });
    }

    console.error('Error en signup:', err);
    return res.status(500).render('signup', {
      error: 'Error interno al registrar el usuario',
    });
  }
};

module.exports = {
  getRedirectByRole,
  login,
  signup,
  googleAuth,
  googleCallback,
};
