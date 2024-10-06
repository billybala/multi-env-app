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

    // Guardar el artículo en la base de datos
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
const getAll =(req, res) => {
    let consulta = Movie.find({});

    consulta.sort({date: -1}).exec().then((movies) => {
        if (!movies) {
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado artículos !!"
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
    let movie_id = req.params.id;

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

// Método para editar una película
const edit = (req, res) => {
    // Recoger id articulo a editar
    let edit_id= req.params.id;

    // Recoger datos del body
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

    // Buscar y actualizar artículo
    Movie.findOneAndUpdate({_id: edit_id}, req.body, {new: true}).then((editedmovie) => {
        if (!editedmovie) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar la película"
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "Success",
            movie: editedmovie
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
    deleteOne,
    edit
};
