const role_validation = require('./role-validation')//Verifica si el rol del usuario que hace el request tiene permisos
const jwt_validation = require('./JWT-validation')
const field_validation = require('./validations')//Verifica los errores que hubo

module.exports = {
    ...role_validation,
    ...jwt_validation,
    ...field_validation
}