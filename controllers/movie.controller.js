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

module.exports = {
    getMovieByTitle
};
