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

const getRedirectByRole = (role) => {
  if (role === 'admin') return '/admin';
  return '/';
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña obligatorios' });
    }

    const user = await userModel.findByEmail(email.trim());

    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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

    const redirectTo = getRedirectByRole(user.role);

    if (req.is('application/json') && !req.is('application/x-www-form-urlencoded')) {
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
    return res.status(500).json({ message: 'Error interno en el login' });
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

    const redirectTo = getRedirectByRole(user.role);
    return res.redirect(redirectTo);
  } catch (err) {
    console.error('Error en el Google OAuth callback:', err);
    return res.status(500).render('login', {
      error: 'Error al autenticar con Google',
    });
  }
};

module.exports = {
  login,
  googleAuth,
  googleCallback,
};
