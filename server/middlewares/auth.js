const jwt = require('jsonwebtoken')
//Verifica token
const auth = (req, res, next) => {

    let token = req.get('token')
    
    //Verifica el token si es valido, si esta firmado si es asi guarda datos en req.usuario si no responde con error
    jwt.verify(token, process.env.SEED_AUTH, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next()
    })
    // .then((decoded) => {
    //     req.usuario = decoded.usuario;
    //     return next();
    // })
    // .catch(err =>{
    //     return res.status(401).json({
    //         ok: false,
    //         err
    //     })
    // })

}

const verifyRole = (req, res, next) => {

    //Verifica el rol del token, este middleware se usa en peticiones de modificacion de la coleccion de la BD.
    //En este caso peticiones PUT, POST, DELETE de las ruta api/usuario/
    if(req.usuario.role === "ADMIN_ROLE")
        next();
    else{
        return res.status(401).json({
            ok: false,
            err:{
                message:"Este usuario no es administrador"
            }
        })
    }
}

module.exports = {
    auth,
    verifyRole
}