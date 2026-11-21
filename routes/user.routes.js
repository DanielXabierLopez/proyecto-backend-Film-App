const express = require("express");
const userController = require("../controllers/user.controller");

// Este router se monta en /api con isAuthenticated delante (ver app.js):
// todas sus rutas exigen sesión y trabajan con req.user.
const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener el perfil del usuario con la sesión iniciada
 *     description: Usuario o administrador. Los datos se leen de la base de datos (SQL); nunca incluye la contraseña.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: 1
 *                 name: Lucía Pérez
 *                 email: lucia@filmapp.test
 *                 role: user
 *                 created_at: 2026-11-20T10:00:00.000Z
 *       401:
 *         description: No autenticado
 *       404:
 *         description: El usuario del token ya no existe
 *       500:
 *         description: Error al obtener el usuario
 */
router.get("/user", userController.getUser);

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Editar el perfil del usuario con la sesión iniciada
 *     description: |
 *       Solo se pueden cambiar `name` y `email` del propio usuario (el id sale del token).
 *       Si llegan `role` o `id` en el body, se ignoran. Renueva la cookie `token` con los datos nuevos.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             example:
 *               name: Lucía Pérez
 *               email: lucia@filmapp.test
 *     responses:
 *       200:
 *         description: Perfil actualizado. Devuelve `user` con los datos nuevos.
 *       400:
 *         description: Datos no válidos o email ya registrado (lista en `errors`)
 *       401:
 *         description: No autenticado
 *       404:
 *         description: El usuario del token ya no existe
 *       500:
 *         description: Error al actualizar el perfil
 */
router.put("/user", userController.updateUser);

module.exports = router;
