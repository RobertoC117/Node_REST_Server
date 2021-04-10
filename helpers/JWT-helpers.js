const jwt = require('jsonwebtoken')

const generarJWT = (uid = '') =>{
    return new Promise((resolve, reject) => {
        //Creacion del token con una clave declarada en /config/.env al igual que el tiempo de vida del token
        jwt.sign({uid}, process.env.SEED_AUTH, {expiresIn: process.env.EXP_TOKEN}, (err, token)=>{
            if(err){
                console.log(err)
                reject("No se pudo generar el JWT")
            }else{
                resolve(token)
            }
        })
    })
}

const verificarJWT = (token) => {
    return new Promise((resolve, reject)=>{
        //Verifica si el token esta firmado
        jwt.verify(token, process.env.SEED_AUTH,(err, decoded)=>{
            if(err){
                console.log(err)
                reject('El token no tiene una firma valida')
            }else{
                resolve(decoded)//Retorna desencriptado el payload del token 
            }
        })
    })
}

module.exports = {
    generarJWT,
    verificarJWT
}