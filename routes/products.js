const { Router } = require('express')
const { check } = require('express-validator')
const { crearProducto, obtenerProductos, buscarProducto, actualizarProducto, eliminarProducto } = require('../controllers/products.controller')
const { existeCategoria, existeProductoID } = require('../helpers/db-validator')
const { JWT_validator, checkValidationErrors } = require('../middlewares')

const router = Router()

router.get('/productos', [
    JWT_validator,
    checkValidationErrors
], obtenerProductos)

router.get('/productos/:id', [
    JWT_validator,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProductoID),
    checkValidationErrors
], buscarProducto)

router.post('/productos', [
    JWT_validator,
    check('nombre').isString().isLength({min:3, ma:20}),
    check('precio').if(check('precio').exists()).isNumeric(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('descripcion').if(check('descripcion').exists()).isString().isLength({min:10, max:100}).withMessage('La descripcion debe contener de 10 a 100 caracteres'),
    checkValidationErrors
], crearProducto)

router.put('/productos/:id', [
    JWT_validator,
    check('id').isMongoId(),
    check('id').custom(existeProductoID),
    checkValidationErrors
], actualizarProducto)

router.delete('/productos/:id',[
    JWT_validator,
    check('id').isMongoId(),
    check('id').custom(existeProductoID),
    checkValidationErrors
], eliminarProducto)

module.exports = router