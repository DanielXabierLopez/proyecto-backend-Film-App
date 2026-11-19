const express = require("express");
const movieController = require("../controllers/movie.controller");
const checkRole = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: imdbID si viene de OMDB, _id si viene de MongoDB
 *           example: tt0133093
 *         source:
 *           type: string
 *           enum: [omdb, mongo]
 *           example: omdb
 *         title:
 *           type: string
 *           example: The Matrix
 *         poster:
 *           type: string
 *           nullable: true
 *         year:
 *           type: integer
 *           nullable: true
 *           example: 1999
 *         director:
 *           type: string
 *           nullable: true
 *         genre:
 *           type: string
 *           nullable: true
 *           example: Action, Sci-Fi
 *         runtime:
 *           type: integer
 *           nullable: true
 *           description: Duración en minutos
 *           example: 136
 *         synopsis:
 *           type: string
 *           nullable: true
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *           nullable: true
 *           example: 8.7
 */

/**
 * @swagger
 * /api/movie/{title}:
 *   get:
 *     summary: Buscar película o películas por título
 *     description: Busca primero en OMDB y, si no hay resultados, en MongoDB.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Título (o parte del título) de la película
 *     responses:
 *       200:
 *         description: Películas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Título vacío
 *       404:
 *         description: No hay resultados
 *       500:
 *         description: Error al buscar películas
 */
router.get("/movie/:title", movieController.getMovieByTitle);

/**
 * @swagger
 * /api/movie/{id}:
 *   put:
 *     summary: Editar una película (solo admin)
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: _id de la película en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: The Matrix
 *               year: 1999
 *               runtime: 136
 *     responses:
 *       200:
 *         description: Película editada
 *       400:
 *         description: Id no válido o datos que no pasan la validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 *       404:
 *         description: La película no existe
 *       500:
 *         description: Error al editar la película
 */
router.put("/movie/:id", checkRole(["admin"]), movieController.updateMovie);

/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     summary: Eliminar una película (solo admin)
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: _id de la película en MongoDB
 *     responses:
 *       200:
 *         description: Película eliminada
 *       400:
 *         description: Id no válido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 *       404:
 *         description: La película no existe
 *       500:
 *         description: Error al eliminar la película
 */
router.delete("/movie/:id", checkRole(["admin"]), movieController.deleteMovie);

module.exports = router;
