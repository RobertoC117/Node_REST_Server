const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')//Modelo de Usuario
const { generarJWT } = require('../helpers/JWT-helpers');

const logIn = (req, res) =>{
    //Toma los datos del cuerpo de la solicitud
    let {email, password} = req.body;
    let usuario;

    Usuario.findOne({email, estado: true})//Busca usuario con email y password
    .then((data) =>{
        //Si no existe entonces
        if(!data)
        {
            return res.status(400).json({
                ok:false,
                err:{
                    message:"(Usuario) o contraseña incorrectos"
                }
            })
        }

        //Compara la contraseña encriptada con la que recibe en caso que no coincidan
        if(!bcrypt.compareSync(password, data.password))
        {
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Usuario o (contraseña) incorrectos"
                }
            })
        }

        usuario = data

        //Creacion del token con una clave declarada en /config/.env al igual que el tiempo de vida del token
        return generarJWT(data._id)
        
    }).then((token) => {
        //Retorna un token con el id del usuario logeado
        res.json({
            ok: true,
            usuario,
            token
        })
    })
    .catch((err) =>{
        console.log(err)
        res.status(500).json({
            ok: false,
            err: {
                message: err.message,
                body: err
            }
        })
    })
}

module.exports = {
    logIn
}