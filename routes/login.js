const {Router} = require('express');
const Usuario = require('../models/usuario')//Modelo de Usuario
const router = Router();
const {logIn, googleSignIn} = require('../controllers/login.controller')

const { check } = require('express-validator')//verifica cualquier valor que venga en parametro, query o body del request
const { checkValidationErrors } = require('../middlewares/validations')//Verifica los errores que hubo

//Ruta de logeo
router.post("/login", [
    check('email','Este no es un email valido').isEmail(), //Valida el email
    check('password','El password es requerido').exists({checkFalsy: true}), //Valida contraseña ("", null, false, 0)
    checkValidationErrors//Verifica si existe algun error en las validaciones antes de ejecutar la accion de la ruta
], logIn);

router. post("/googleSignIn",[
    check('id_token','El token es requerido').exists({checkFalsy: true}), //Valida contraseña ("", null, false, 0)
    checkValidationErrors//Verifica si existe algun error en las validaciones antes de ejecutar la accion de la ruta
], googleSignIn)

module.exports = router;