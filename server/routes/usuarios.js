/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */
const express = require('express');
const app = express();
const Usuario = require('../models/usuarios')//Modelo de Usuario

app.get('/', (req, res) => {
    res.send("main")
});

app.get('/usuario', (req, res) => {
    res.send("getUsuario")
});

app.post('/usuario', (req, res) => {

    let data = req.body;//Obtiene el cuerpo de la peticion

    let usuario = new Usuario({//Crea un nuevo objeto
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        role: data.role,
    });

    usuario.save((err, usuarioDB) => {//Guarda el objeto

        if(err){//Si falla envia un codigo de error con la descripcion de este y rompe la funcion
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({//Si es exitoso envia un true y muestra los datos del usuario insertado
            ok: true, 
            usuario: usuarioDB
        })

    })

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({id})
});

app.delete('/usuario', (req, res) => {
    //res.json({nombre:"Roberto"})
    res.send("deleteUsuario")
});

module.exports = app;