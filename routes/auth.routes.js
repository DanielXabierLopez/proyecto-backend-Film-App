const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Este router solo tiene rutas públicas (Google OAuth): se monta en /api/auth
// antes que las rutas privadas de la API (ver app.js).

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     description: |
 *       Ruta registrada en app.js (no aquí, porque este router está montado en /api/auth).
 *       Abre la sesión con un JWT en la cookie httpOnly `token`.
 *       Desde el formulario de la vista redirige a /dashboard (usuario) o /movies (admin);
 *       si se envía JSON responde con JSON.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: lucia@filmapp.test
 *               password: "123456"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcto (petición JSON). Incluye `user`, `redirectTo` y `token`.
 *       302:
 *         description: Login correcto (formulario). Redirige a /dashboard o /movies según el rol.
 *       400:
 *         description: Falta el email o la contraseña
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno en el login
 */

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: |
 *       Ruta registrada en app.js (no aquí, porque este router está montado en /api/auth).
 *       Borra la cookie `token`. Es pública: funciona aunque el token haya caducado.
 *       Desde el botón "Salir" de la vista redirige a /; si se envía JSON responde con JSON.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada (petición JSON). Incluye `redirectTo`.
 *       302:
 *         description: Sesión cerrada (formulario). Redirige a /.
 */

// Rutas públicas de Google OAuth (login y logout con email están en app.js)
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

module.exports = router;