/**
 * Controlador de las vistas web (Server Side Rendering con Pug).
 * Cada función pinta una plantilla de /views con los datos que necesita.
 *
 * `req.user` lo rellenará el middleware de autenticación cuando esté hecho.
 * Mientras tanto vale undefined y las vistas lo tienen en cuenta.
 */

const fakeUsers = require('../data/fakeUsers');

/** GET / - Inicio con formulario de login */
const getHome = (req, res) => {
    res.render('home', { title: 'Film App - Inicio' });
};

/** GET /login - Formulario de login */
const getLogin = (req, res) => {
    res.render('login', { title: 'Film App - Iniciar sesión' });
};

/** GET /signup - Formulario de registro */
const getSignup = (req, res) => {
    res.render('signup', { title: 'Film App - Registro' });
};

/** GET /dashboard - Panel de control del usuario */
const getDashboard = (req, res) => {
    res.render('dashboard', { title: 'Film App - Panel de control', user: req.user });
};

/** GET /search?title=... - Buscador de películas */
const getSearch = async (req, res) => {
    const query = req.query.title;
    // TODO: si hay query, pedir las películas al servicio de búsqueda (OMDB y después MongoDB)
    const movies = [];

    res.render('search', { title: 'Film App - Buscar', user: req.user, query, movies });
};

/** GET /search/:title - Detalle de una película */
const getDetail = async (req, res) => {
    // TODO: pedir al servicio de búsqueda la película con req.params.title
    const movie = null;

    res.render('detail', { title: 'Film App - Detalle', user: req.user, movie });
};

/**
 * GET /movies (y /favorites)
 * El README usa /movies para el usuario (sus favoritas) y para el admin (gestión),
 * así que se elige la vista según el rol.
 */
const getMovies = async (req, res) => {
    if (req.user && req.user.role === 'admin') {
        // TODO: pedir todas las películas de MongoDB
        const movies = [];
        return res.render('adminMovies', { title: 'Film App - Gestionar películas', user: req.user, movies });
    }

    // TODO: pedir los favoritos del usuario (SQL) y sus datos a su fuente (OMDB o MongoDB)
    const movies = [];
    res.render('movies', { title: 'Film App - Mis películas', user: req.user, movies });
};

/** GET /profile - Perfil del usuario o del administrador */
const getProfile = (req, res) => {
    res.render('profile', { title: 'Film App - Mi perfil', user: req.user });
};

/** GET /users - Lista de usuarios (admin) */
const getUsers = async (req, res) => {
    // TODO: pedir la lista de usuarios a la base de datos SQL
    // TEMPORAL: mientras tanto usamos los usuarios falsos
    const users = fakeUsers;

    res.render('users', { title: 'Film App - Usuarios', user: req.user, users });
};

module.exports = {
    getHome,
    getLogin,
    getSignup,
    getDashboard,
    getSearch,
    getDetail,
    getMovies,
    getProfile,
    getUsers
};
