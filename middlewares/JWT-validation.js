const { verificarJWT } = require('../helpers/JWT-helpers')
const {Usuario} = require('../models')

//Verifica token
const JWT_validator = (req, res, next) => {

    //Obtiene el token del header de la solicitud
    let token = req.header('token')

    //Si no existe...
    if(!token)
    {
        return res.status(401).json({
            ok: false,
            err:"El token de autenticacion es requerido"
        })
    }
    
    //Verifica el token si es valido, si esta firmado si es asi guarda datos en req.usuarioAutenticado si no responde con error
    verificarJWT(token)
    .then(token_data => {//Retorna lo que existe en el token (el id en este caso)
        return Usuario.findById(token_data.uid)
    })
    .then(usuario =>{//Verifica si el usuario que hace la solicitud esta habilitado si no manda error
        if(!usuario.estado){
            throw new Error('Este usuario no tiene los permisos necesarios -estado:false')
        }
        //Si esta habilitado guarda sus datos en la peticion y next XD
        req.usuarioAutenticado = usuario
        next()
    })
    .catch((err)=>{
        console.log(err)
        return res.status(401).json({
            ok: false,
            err:{
                msg:err.message,
                body:err
            }
        })
    })
}

module.exports = {
    JWT_validator,
}