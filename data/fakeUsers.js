/**
 * Usuarios falsos para trabajar mientras no está la base de datos SQL.
 * Tienen los mismos campos que usan las vistas: id, name, email y role.
 *
 * Cuando la BBDD esté lista, se borra este archivo y los datos
 * se piden al modelo de usuarios.
 */
const fakeUsers = [
    { id: 1, name: 'Lucía Pérez', email: 'lucia@filmapp.test', role: 'user' },
    { id: 2, name: 'Admin Demo', email: 'admin@filmapp.test', role: 'admin' }
];

module.exports = fakeUsers;
