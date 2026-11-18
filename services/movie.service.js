/**
 * Servicio de películas: une las dos fuentes de datos (OMDB y MongoDB)
 * para que el origen sea transparente para el usuario.
 */

const omdbService = require("./omdb.service");
const Movie = require("../models/movie.model");

/** @typedef {import("./omdb.service").MovieResult} MovieResult */

/**
 * Convierte un documento de MongoDB al formato común de la app.
 * @param {Object} doc Documento de la colección `movies`.
 * @returns {MovieResult}
 */
const normalizeMongoMovie = (doc) => ({
    id: String(doc._id),
    source: "mongo",
    title: doc.title,
    poster: doc.poster,
    year: doc.year,
    director: doc.director,
    genre: doc.genre,
    runtime: doc.runtime,
    synopsis: doc.synopsis,
    actors: doc.actors || [],
    rating: doc.rating
});

/**
 * Escapa los caracteres especiales de regex para buscar el texto tal cual.
 * @param {string} text
 * @returns {string}
 */
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Busca películas por título en MongoDB (parcial y sin distinguir mayúsculas).
 * @param {string} title
 * @returns {Promise<MovieResult[]>}
 */
const searchInMongo = async (title) => {
    const docs = await Movie.find({
        title: new RegExp(escapeRegex(title), "i")
    }).lean();

    return docs.map(normalizeMongoMovie);
};

/**
 * Busca películas por título siguiendo el orden del enunciado:
 *  1. Primero en OMDB. Si hay resultados, se devuelven (sin guardarlos en BBDD).
 *  2. Si OMDB no encuentra nada, se busca en MongoDB.
 *  3. Si tampoco hay nada, se devuelve un array vacío.
 *
 * Si OMDB falla (caído, sin API key...), se sigue buscando en MongoDB.
 *
 * @param {string} title Título (o parte del título) a buscar.
 * @returns {Promise<MovieResult[]>}
 */
const searchMovies = async (title) => {
    try {
        const omdbMovies = await omdbService.searchByTitle(title);
        if (omdbMovies.length > 0) {
            return omdbMovies;
        }
    } catch (error) {
        console.error("Error buscando en OMDB, se busca en MongoDB:", error.message);
    }

    return searchInMongo(title);
};

module.exports = {
    normalizeMongoMovie,
    searchMovies
};
