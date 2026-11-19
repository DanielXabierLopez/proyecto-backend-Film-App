const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_cambiar_en_env';

const isAuthenticated = (req, res, next) => {
const cookieToken = req.cookies && req.cookies.token;
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;
    const token = cookieToken || bearerToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        };
      } catch (err) {
        if (req.originalUrl.startsWith('/api')) {
          return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        return res.redirect('/');
      }
    }
  
  // Verificamos si existe el usuario
  if (req.user || (req.session && req.session.user)) {
    return next();
  }
  
  // Si no hay sesión activa: la API responde 401 en JSON,
  // las vistas redirigen a la página principal (/)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  return res.redirect('/');
};

module.exports = isAuthenticated;