const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Ajusta según tu controlador
const isAuthenticated = require('../middlewares/auth.middleware');

// Rutas públicas (login, registro, etc.)
// router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/dashboard:
 *   get:
 *     summary: Obtener el panel de control del usuario autenticado
 *     responses:
 *       200:
 *         description: Renderiza el dashboard correctamente
 */
// Ejemplo de ruta protegida usando el middleware que comprueba la sesión
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;