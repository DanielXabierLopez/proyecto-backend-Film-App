const isAuthenticated = (req, res, next) => {
  // Verificamos si existe el usuario
  if (req.user || (req.session && req.session.user)) {
    return next();
  }
  
  // Si no hay sesión activa, se te redirige a la página principal (/)
  return res.redirect('/');
};

module.exports = isAuthenticated;