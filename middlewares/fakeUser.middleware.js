/**
 * Middleware TEMPORAL: simula un usuario logueado rellenando `req.user`
 * con uno de los usuarios falsos. Sustituye al middleware de autenticación
 * hasta que esté hecho.
 *
 * Se elige el rol con la variable de entorno FAKE_USER_ROLE:
 *   FAKE_USER_ROLE=admin  -> entra como administrador
 *   (cualquier otro valor o sin definir) -> entra como usuario normal
 */
const fakeUsers = require('../data/fakeUsers');

const fakeUser = (req, res, next) => {
    const role = process.env.FAKE_USER_ROLE === 'admin' ? 'admin' : 'user';
    req.user = fakeUsers.find(u => u.role === role);
    next();
};

module.exports = fakeUser;
