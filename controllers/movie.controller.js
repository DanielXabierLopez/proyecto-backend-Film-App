const Movie = require("../models/movie.model");

const createMovie = async (req, res) => {
    try {

        const movieData = {
            ...req.body,
            actors: req.body.actors
                ? req.body.actors.split(",").map(actor => actor.trim())
                : []
        };

        await Movie.create(movieData);

        res.redirect("/movies");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error creando película");

    }
};

module.exports = {
    createMovie
};