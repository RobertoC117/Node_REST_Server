/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */
const express = require('express');
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuarios')//Modelo de Usuario
const _ = require('underscore')//En si la libreria cotiene mas funciones para facilitarte trabajar con estructuras de datos
const app = express();

app.get('/', (req, res) => {
    res.send("main")
});

app.get('/usuario', (req, res) => {
    res.send("getUsuario")
});

app.post('/usuario', (req, res) => {

    let data = req.body;//Obtiene el cuerpo de la peticion

    let usuario = new Usuario({//Crea un nuevo objeto del modelo
        nombre: data.nombre,
        email: data.email,
        password: bcrypt.hashSync( data.password, 10),
        role: data.role,
    });

    usuario.save()
    .then(usuarioDB => {
        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
    .catch(err => {
        res.status(400).json({
            ok: false,
            err,
        });
    })


});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //Validacion filtra del objeto que se le pasa las propiedades permitidas por el arreglo 
    //para evitra que actualicen la contraseña y otros datos que no deben ser cambiados desde esta seccion
    let data = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, data, {new: true, runValidators: true})
    .then(doc => {
        res.json({
            ok: true,
            usuario: doc
        })
    })
    .catch(err => {
        res.status(400).json({
            ok: false,
            err,
        })
    })

});

app.delete('/usuario', (req, res) => {
    //res.json({nombre:"Roberto"})
    res.send("deleteUsuario")
});

module.exports = app;