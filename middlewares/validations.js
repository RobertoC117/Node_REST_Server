const { validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) =>{

    //devuelve los errores que se añadieron al request 
    const results = validationResult(req)
    //en caso de existir da una respuesta de error
    if(!results.isEmpty()){
        return res.status(400).json({ok: false, results})
    }

    //Si no, next XD
    next();
}

module.exports = {
    checkValidationErrors,
}