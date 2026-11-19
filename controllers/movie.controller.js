const mongoose = require("mongoose");
const movieService = require("../services/movie.service");

/**
 * GET /api/movie/:title
 * Busca películas por título (primero en OMDB y, si no hay resultados, en MongoDB).
 *
 * - 200 `{ movies }` si hay coincidencias.
 * - 400 si el título está vacío.
 * - 404 `{ message: "No hay resultados", movies: [] }` si no hay coincidencias.
 * - 500 si ocurre un error inesperado.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getMovieByTitle = async (req, res) => {
    const title = (req.params.title || "").trim();

    if (!title) {
        return res.status(400).json({ message: "Debes indicar un título" });
    }

    try {
        const movies = await movieService.searchMovies(title);

        if (movies.length === 0) {
            return res.status(404).json({ message: "No hay resultados", movies: [] });
        }

        return res.status(200).json({ movies });
    } catch (error) {
        console.error("Error en GET /api/movie/:title:", error);
        return res.status(500).json({ message: "Error al buscar películas" });
    }
};

/**
 * PUT /api/movie/:id (solo admin)
 * Edita una película de MongoDB con los datos del body.
 *
 * - 200 `{ movie }` si se ha editado.
 * - 400 si el id no es válido o los datos no pasan la validación del modelo.
 * - 404 si no existe ninguna película con ese id.
 * - 500 si ocurre un error inesperado.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const updateMovie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "El id no es válido" });
    }

    try {
        const movie = await movieService.updateMovie(id, req.body);

        if (!movie) {
            return res.status(404).json({ message: "La película no existe" });
        }

        return res.status(200).json({ movie });
    } catch (error) {
        // ValidationError: no cumple las reglas del modelo (ej. año fuera de rango)
        // CastError: un campo tiene un tipo incorrecto (ej. year: "abc")
        if (error.name === "ValidationError" || error.name === "CastError") {
            const errors = error.errors
                ? Object.values(error.errors).map((err) => err.message)
                : [error.message];
            return res.status(400).json({ message: "Datos no válidos", errors });
        }

        console.error("Error en PUT /api/movie/:id:", error);
        return res.status(500).json({ message: "Error al editar la película" });
    }
};

/**
 * DELETE /api/movie/:id (solo admin)
 * Elimina una película de MongoDB por su _id.
 *
 * - 200 `{ message: "Película eliminada", movie }` si se ha borrado.
 * - 400 si el id no es un ObjectId válido.
 * - 404 `{ message: "La película no existe" }` si no existe ninguna película con ese id.
 * - 500 si ocurre un error inesperado.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const deleteMovie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "El id no es válido" });
    }

    try {
        const movie = await movieService.deleteMovie(id);

        if (!movie) {
            return res.status(404).json({ message: "La película no existe" });
        }

        // TODO: borrar también los favoritos de esta película (SQL). Esa parte se hará cuando exista la tabla de favoritos.

        return res.status(200).json({ message: "Película eliminada", movie });
    } catch (error) {
        console.error("Error en DELETE /api/movie/:id:", error);
        return res.status(500).json({ message: "Error al eliminar la película" });
    }
};

module.exports = {
    getMovieByTitle,
    updateMovie,
    deleteMovie
};
