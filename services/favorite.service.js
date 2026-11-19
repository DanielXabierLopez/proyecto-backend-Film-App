/**
 * Servicio de favoritos: une la tabla `favorites` (SQL) con las fuentes
 * de datos de las películas (OMDB o MongoDB).
 * Lo usan la API (GET /api/favorites) y la vista "Mis películas" (/movies).
 */

const Favorite = require("../models/favorite.model");
const movieService = require("./movie.service");

/** @typedef {import("./omdb.service").MovieResult} MovieResult */

/**
 * Devuelve las películas favoritas de un usuario con todos sus datos,
 * pidiendo cada una a su fuente original.
 * Las que ya no existen o fallan al pedirse se omiten, para que un fallo
 * de OMDB o una película borrada de MongoDB no rompa la lista entera.
 *
 * @param {number} userId
 * @returns {Promise<MovieResult[]>}
 */
const getFavoriteMovies = async (userId) => {
    const favorites = await Favorite.getByUser(userId);

    const results = await Promise.allSettled(
        favorites.map((fav) => movieService.getMovieBySource(fav.movie_id, fav.source))
    );

    return results
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value);
};

module.exports = {
    getFavoriteMovies
};
