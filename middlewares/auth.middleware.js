const isAuthenticated = (req, res, next) => {
  // Verificamos si existe el usuario
  if (req.user || (req.session && req.session.user)) {
    return next();
  }
  
  // Si no hay sesión activa: la API responde 401 en JSON,
  // las vistas redirigen a la página principal (/)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return res.redirect('/');
};

module.exports = isAuthenticated;