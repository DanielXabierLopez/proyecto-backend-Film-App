const express = require('express');
const views = require('../controllers/views.controller');

const router = express.Router();

// Vistas públicas
router.get('/', views.getHome);
router.get('/login', views.getLogin);
router.get('/signup', views.getSignup);

// Vistas privadas
// TODO: añadir aquí los middlewares de sesión y de rol cuando estén hechos
router.get('/dashboard', views.getDashboard);
router.get('/search', views.getSearch);
router.get('/search/:title', views.getDetail);
router.get('/movies', views.getMovies);
router.get('/favorites', views.getMovies);
router.get('/profile', views.getProfile);
router.get('/users', views.getUsers);

module.exports = router;
