/**
 * ADMINISTRACION DE LAS RUTAS DE LAS CATEGORIAS
 */

//#region IMPORTACIONES
const {Router} = require('express');
const router = Router();
//check verifica cualquier valor que venga en parametro, query o body del request
//param solo verifica los valores de los parametros de ruta
const { check, param } = require('express-validator');
const { crearCategoria, obtenerCategorias, buscarCategoria, actualizarCategoria, eliminarCategoria} = require('../controllers/categories.controller');
const { existeCategoria, existeNombreCategoria } = require('../helpers/db-validator');
const { checkValidationErrors, JWT_validator, isAdminRole } = require('../middlewares')
//#endregion

//Obtener todas las categorias - ruta publica 
router.get('/categorias',[
    JWT_validator
], obtenerCategorias)

//Obtener categoria por id - ruta publica
router.get('/categorias/:id',[
    JWT_validator,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    checkValidationErrors
], buscarCategoria)

//Crear una nueva categoria - privado(cualquier role)
router.post('/categorias', [
    JWT_validator,
    check('nombre','El nombre es obligatorio').notEmpty().isLength({min:3, max:15}).withMessage("El nombre de la categoria debe contener de 3 a 15 caracteres"),
    checkValidationErrors
], crearCategoria)

//Actualizar una categoria - privado(cualquier role)
router.put('/categorias/:id',[
    JWT_validator,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre','El nombre es obligatorio').notEmpty().isLength({min:3, max:15}).withMessage("El nombre de la categoria debe contener de 3 a 15 caracteres"),
    check('nombre').custom(existeNombreCategoria),
    checkValidationErrors
], actualizarCategoria)

//Borrar una categoria - privado(cualquier role)
router.delete('/categorias/:id',[
    JWT_validator,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    checkValidationErrors
], eliminarCategoria)

module.exports = router