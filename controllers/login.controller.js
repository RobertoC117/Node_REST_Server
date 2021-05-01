const bcrypt = require('bcrypt')
const {Usuario} = require('../models')//Modelo de Usuario
const { generarJWT } = require('../helpers/JWT-helpers');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res) =>{
    let id_token = req.header('id_token')

    try {
        let googleUser = await googleVerify(id_token)
        const {email} = googleUser
        let usuario =  await Usuario.findOne({email})
        
        //Si no existe crea el usuario
        if(!usuario){
            console.log('gei')
            let data = {
                password : 'xD',
                ...googleUser
            }
            usuario = new Usuario(data)
            console.log(usuario)
            await usuario.save()
    
        }
        
        if(!usuario.estado){
    
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        let token = await generarJWT(usuario.id)
        console.log(usuario.id)

        res.json({
            msg: "Ok google",
            googleUser,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg:"Token no valido",
            err
        })
    }

}

module.exports = {
    logIn,
    googleSignIn
}