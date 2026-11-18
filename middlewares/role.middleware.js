const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Obtenemos el usuario del request 
    const user = req.user || (req.session && req.session.user);

    // Las rutas de la API responden con JSON; las vistas redirigen o muestran texto
    const isApi = req.originalUrl.startsWith('/api');

    if (!user) {
      if (isApi) {
        return res.status(401).json({ error: 'No autenticado' });
      }
      return res.redirect('/');
    }

    // El rol viene del campo 'role' del usuario (igual que en data/fakeUsers.js)
    const userRole = user.role;

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Si no tiene el rol, se deniega el acceso
    if (isApi) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    return res.status(403).send('Acceso denegado: No tienes los permisos.');
  };
};

module.exports = checkRole;