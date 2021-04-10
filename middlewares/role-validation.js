/**
 * VALIDACION DE ROLES
 */
//Verifica si el rol es admin
const isAdminRole = (req, res, next) => {

    if(!req.usuarioAutenticado){
        return res.status(500).json({
            ok: false,
            msg: "Se esta intentando validar el rol del usuario sin un token"
        })
    }

    const {role, nombre} = req.usuarioAutenticado

    //Verifica el rol del token, este middleware se usa en peticiones de modificacion de la coleccion de la BD.
    //En este caso peticiones PUT, POST, DELETE de las ruta api/usuario/
    if(role === "ADMIN_ROLE")
        next();
    else{
        return res.status(401).json({
            ok: false,
            err:{
                message:`${nombre} no es administrador`
            }
        })
    }
}

//verifica si el rol esta dentro de los permitidos
const tieneRole = (...roles) => (req, res, next) =>{
    if(!req.usuarioAutenticado){
        return res.status(500).json({
            ok: false,
            msg: "Se esta intentando validar el rol del usuario sin un token"
        })
    }

    let {role, nombre} = req.usuarioAutenticado
    if(!roles.includes(role)){
        return res.status(401).json({
            ok: false,
            err:{
                message:`${nombre} no tiene permisos para ejecutar esta accion`
            }
        })
    }
    next()
}

module.exports = {
    isAdminRole,
    tieneRole
}