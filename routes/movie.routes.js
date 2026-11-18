const express = require("express");
const movieController = require("../controllers/movie.controller");

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

module.exports = router;
