const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Obtenemos el usuario del request 
    const user = req.user || (req.session && req.session.user);

    if (!user) {
      return res.redirect('/');
    }

    // El rol viene del campo 'rol' del usuario en la base de datos
    const userRole = user.rol;

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Si no tiene el rol, se deniega el acceso
    return res.status(403).send('Acceso denegado: No tienes los permisos.');
  };
};

module.exports = checkRole;