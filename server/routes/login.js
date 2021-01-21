const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuarios')//Modelo de Usuario
const app = express();

app.post("/login",(req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email})
    .then((usuario) =>{

        if(!usuario)
        {
            return res.status(400).json({
                ok:false,
                err:{
                    message:"(Usuario) o contraseña incorrectos"
                }
            })
        }

        if(!bcrypt.compareSync(body.password, usuario.password))
        {
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Usuario o (contraseña) incorrectos"
                }
            })
        }

        let token = jwt.sign({usuario}, process.env.SEED_AUTH, {expiresIn: process.env.EXP_TOKEN})

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
});

module.exports = app;