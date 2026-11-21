const express = require("express");
const userController = require("../controllers/user.controller");
const checkRole = require("../middlewares/role.middleware");

// Este router se monta en /api con isAuthenticated delante (ver app.js):
// todas sus rutas exigen sesión y trabajan con req.user.
// - /user (sin id): el perfil propio, usuario o admin.
// - /user y /user/:id con checkRole(["admin"]): gestión de usuarios (vista /users).
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

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Crear un usuario (solo admin)
 *     description: |
 *       Da de alta un usuario con el rol elegido. A diferencia de /api/signup, NO abre sesión
 *       (el admin sigue con la suya). La contraseña se guarda cifrada con bcrypt.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             example:
 *               name: Nuevo Usuario
 *               email: nuevo@filmapp.test
 *               password: "123456"
 *               role: user
 *     responses:
 *       201:
 *         description: Usuario creado. Devuelve `user` (sin la contraseña).
 *       400:
 *         description: Datos no válidos o email ya registrado (lista en `errors`)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 *       500:
 *         description: Error al crear el usuario
 */
router.post("/user", checkRole(["admin"]), userController.createUserByAdmin);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Editar un usuario (solo admin)
 *     description: |
 *       Cambia nombre, email y rol. La contraseña no se puede cambiar desde aquí.
 *       El admin no puede quitarse a sí mismo el rol de admin.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role]
 *             example:
 *               name: Lucía Pérez
 *               email: lucia@filmapp.test
 *               role: user
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos no válidos, email ya registrado o intento de quitarse el rol de admin
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error al actualizar el usuario
 *   delete:
 *     summary: Borrar un usuario (solo admin)
 *     description: Sus favoritos se borran también (ON DELETE CASCADE). El admin no puede borrarse a sí mismo.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       400:
 *         description: Intento de borrar el propio usuario
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error al eliminar el usuario
 */
router.put("/user/:id", checkRole(["admin"]), userController.updateUserByAdmin);
router.delete("/user/:id", checkRole(["admin"]), userController.deleteUserByAdmin);

module.exports = router;
