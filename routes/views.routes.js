const express = require('express');
const views = require('../controllers/views.controller');
const isAuthenticated = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

const router = express.Router();

// Vistas públicas
router.get('/', views.getHome);
router.get('/login', views.getLogin);
router.get('/signup', views.getSignup);

// Vistas privadas: sin sesión redirigen a / (README, "Sobre el control de acceso").
// isAuthenticated va en cada ruta y no con router.use(): este router está montado
// en "/", así que un router.use() también bloquearía las rutas públicas de la API
// (/api/login, /api/signup…) que se registran después en app.js.
// isAuthenticated siempre antes de checkRole, que necesita req.user.
router.get('/dashboard', isAuthenticated, views.getDashboard);
router.get('/search', isAuthenticated, views.getSearch);
router.get('/search/:title', isAuthenticated, views.getDetail);
router.get('/movies', isAuthenticated, views.getMovies);
router.get('/favorites', isAuthenticated, views.getMovies);
router.get('/movies/:id/edit', isAuthenticated, checkRole(['admin']), views.getEditMovie);
router.get('/profile', isAuthenticated, views.getProfile);
router.get('/users', isAuthenticated, views.getUsers);

module.exports = router;
