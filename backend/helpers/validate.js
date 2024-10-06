const validator = require("validator");

const validateMovie = (params) => {
    let validar_titulo = !validator.isEmpty(params.title) && validator.isLength(params.title, {min: 5, max: undefined});
    let validar_contenido = !validator.isEmpty(params.content);

    console.log(validar_titulo);
    
    console.log(validar_contenido);
    

    if (!validar_titulo || !validar_contenido) {
        throw new Error("No se ha validado la información !!");
    }
}

module.exports = {
    validateMovie
}
