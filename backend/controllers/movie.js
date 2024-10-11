const { validateMovie } = require("../helpers/validate");
const Movie = require("../models/Movie.js");

// Método para crear una película
const create = (req, res) => {
    // Recoger parámetros por post a guardar en la base de datos
    let params = req.body;    

    // Validar datos
    try {
        validateMovie(params);
    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    // Crear objeto a guardar
    const movie = new Movie(params);

    // Guardar la película en la base de datos
    movie.save().then((savedMovie) => {
        if (!savedMovie) {
            return res.status(400).json({
                status: "error",
                message: "No se ha guardado el artículo"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            message: "Success",
            movie: savedMovie,
            message: "Película creada con éxito !!!"
        });
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Ha ocurrido un error"
        });
    });
};

// Método para obtener todas las películas
const getAll = (req, res) => {
    // Obtención de todas las películas de la base de datos
    let consulta = Movie.find({});

    // Ordenar las películas por fecha de creación
    consulta.sort({date: -1}).exec().then((movies) => {
        if (!movies) {
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado películas !!"
            });
        };

        return res.status(200).send({
            status: "Success",
            numMovies: movies.length,
            movies
        })
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Ha ocurrido un error"
        });
    });
};

// Método para eliminar una película
const deleteOne = (req, res) => {
    // Obtención del id de la película a eliminar
    let movie_id = req.params.id;

    // Búsqueda de la película a eliminar y posterior eliminación
    Movie.findOneAndDelete({_id: movie_id}).then((deletedMovie) => {
        if (!deletedMovie) {
            return res.status(500).json({
                status: "error",
                message: "Error al borrar el artículo"
            });
        }

        return res.status(200).json({
            status: "Success",
            movie: deletedMovie,
            message: "Delete method"
        });
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Ha ocurrido un error"
        });
    });
};

module.exports = {
    create,
    getAll,
    deleteOne
};
