/**
 * Controlador de las vistas web (Server Side Rendering con Pug).
 * Cada función pinta una plantilla de /views con los datos que necesita.
 *
 * `req.user` lo rellenará el middleware de autenticación cuando esté hecho.
 * Mientras tanto vale undefined y las vistas lo tienen en cuenta.
 */

const fakeUsers = require('../data/fakeUsers');
const movieService = require('../services/movie.service');
const favoriteService = require('../services/favorite.service');

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

/** GET /search?title=... - Buscador de películas (OMDB y, si no hay nada, MongoDB) */
const getSearch = async (req, res) => {
    const query = (req.query.title || '').trim();
    let movies = [];
    let error = null;

    if (query) {
        try {
            movies = await movieService.searchMovies(query);
        } catch (err) {
            console.error('Error en GET /search:', err);
            error = 'No se han podido buscar películas. Inténtalo de nuevo.';
        }
    }

    res.render('search', { title: 'Film App - Buscar', user: req.user, query, movies, error });
};

/**
 * GET /search/:title - Detalle de una película.
 * Se busca por título y se elige la que coincide exactamente (sin mayúsculas);
 * si ninguna coincide exacta, la primera de los resultados.
 */
const getDetail = async (req, res) => {
    const title = (req.params.title || '').trim();
    let movie = null;
    let error = null;

    try {
        const movies = await movieService.searchMovies(title);
        movie = movies.find(m => m.title.toLowerCase() === title.toLowerCase()) || movies[0] || null;
    } catch (err) {
        console.error('Error en GET /search/:title:', err);
        error = 'No se ha podido cargar la película. Inténtalo de nuevo.';
    }

    let status = 200;
    if (error) status = 500;
    else if (!movie) status = 404;

    res.status(status).render('detail', { title: 'Film App - Detalle', user: req.user, movie, error });
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

    // Favoritos del usuario (SQL) con sus datos pedidos a su fuente (OMDB o MongoDB)
    let movies = [];
    let error = null;

    try {
        movies = await favoriteService.getFavoriteMovies(req.user.id);
    } catch (err) {
        console.error('Error en GET /movies:', err);
        error = 'No se han podido cargar tus películas. Inténtalo de nuevo.';
    }

    res.status(error ? 500 : 200).render('movies', { title: 'Film App - Mis películas', user: req.user, movies, error });
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
