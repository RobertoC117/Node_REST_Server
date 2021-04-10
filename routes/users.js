/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */

//#region IMPORTACIONES
const {Router} = require('express');
const router = Router();
//check verifica cualquier valor que venga en parametro, query o body del request
//param solo verifica los valores de los parametros de ruta
const { check, param } = require('express-validator')

//Middlewares
const {
    JWT_validator,
    isAdminRole,
    tieneRole,
    checkValidationErrors
} = require('../middlewares/index')

//Controladores de ruta
const {
    getUsers, //muestra los usuarios
    createUser, //crea un usuario
    updateUser, //actualiza un usuario
    deleteUser
} = require('../controllers/user.controller');//inhabilita un usuario

//Helpers
const { 
    roleValidator, //vlida si el rol ingresado existe en la db
    existeUsuarioId, //valida si el usuario con ese id existe
    existeEmail } = require('../helpers/db-validator'); //valida su existe un usuario con el email registrado

//#endregion

router.get('/', (req, res) => {
    res.send("main")
});

//Como segunda argumento enviamos el o los middlewares a utilizar
router.get('/usuario', [
    JWT_validator,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE")
], getUsers);

//Crea usuario
router.post('/usuario',  [
    JWT_validator,
    isAdminRole,
    //valida el nombre del nuevo usuario 
    check('nombre','El nombre debe contener de 6 a 25 caracteres').notEmpty().isLength({min: 6, max:25}),
    //valida email del nuevo usuario
    check('email','Este no es un email valido').isEmail(),
    //valida contraseña del nuevo usuario
    check('password','La contraseña debe contener de 6 a 16 caracteres').isLength({min:6, max:16}),
    //verifica si existe un usuario que ocupe ese email
    check('email').custom(existeEmail),
    //verifica si el rol es valido
    check('role').notEmpty().withMessage("El rol es requerido").custom(roleValidator),
    checkValidationErrors
], createUser);

//Actualiza usuario
router.put('/usuario/:id', [
    JWT_validator, 
    isAdminRole,
    param('id', 'No es un id valido').isMongoId(),//Verifica si el id proveido es un MongoID
    param('id').custom(existeUsuarioId), //Verifica si existe un usuario con ese id
    checkValidationErrors
], updateUser);

//Inhabilita usuario
router.delete('/usuario/:id', [
    JWT_validator, 
    isAdminRole,
    param('id', 'No es un id valido').isMongoId(),
    param('id').custom(existeUsuarioId),
    checkValidationErrors
], deleteUser);


module.exports = router;