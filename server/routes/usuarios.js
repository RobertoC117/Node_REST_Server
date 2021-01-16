/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */
const express = require('express');
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuarios')//Modelo de Usuario
const _ = require('underscore');//En si la libreria cotiene mas funciones para facilitarte trabajar con estructuras de datos
const { json } = require('body-parser');
const { isEmpty } = require('underscore');
const app = express();

app.get('/', (req, res) => {
    res.send("main")
});

app.get('/usuario', (req, res) => {

    //Se manejan parametros opcionales que se almacenan en el objeto query de la peticion(pueden o no existir)
    //RECUPERACION DEL PARAMETRO SALTO Y VALIDACION
    let salto = req.query.salto || 0;
    salto = parseInt(salto);
    salto = isNaN(salto) ? 0 : (salto > 0) ? salto : 0 //Es igual al ejemplo de abajo que esta comentado

    // if(isNaN(salto))
    //     salto = 0;
    // else
    //     salto = salto > 0 ? salto : 0;

    //RECUPERACION DEL PARAMETRO LIMITE Y VALIDACION
    let limite = req.query.limite || 5;
    limite = parseInt(limite);
    limite = isNaN(limite) ? 5 : (limite > 0) ? limite : 5

    //LOGICA DE PROPIEDADES NETX Y PREVIOUS QUE IRAN EN LA RESPUESTA
    let nuevo_salto = salto + limite;
    let next = req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto + '&limite=' + limite;

    nuevo_salto = (salto - limite > 0) ? salto-limite : 0
    let previous = salto === 0 ? null : req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto  + '&limite=' + limite;

    let obj = {ok: true, count: null, data: null}
    Usuario.find({}).skip(salto).limit(limite)
    .then(data => {
        obj.data = data;
        return Usuario.count();
    })
    .then(count =>{
        obj.count = count;
        res.json(obj)
    })
    .catch(err => {
        res.status(400).json({ok:false, err})
    })

    // Usuario.find({}).skip(salto).limit(limite)
    // .then(data => {
    //     res.json({
    //         ok: true,
    //         previous,
    //         next,
    //         data,
    //     });
    // })
    // .catch(err =>{
    //     res.status(400).json({
    //         ok: false,
    //         err,
    //     })
    // })

});

app.post('/usuario', (req, res) => {

    let body = req.body;//Obtiene el cuerpo de la peticion

    let usuario = new Usuario({//Crea un nuevo objeto del modelo
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role,
    });

    usuario.save()
    .then(usuarioDB => {
        usuarioDB.password = null;
        res.json({
            ok: true,
            data: usuarioDB
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
    let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);

    //console.log(isEmpty(body));

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true})
    .then(doc => {
        res.json({
            ok: true,
            data: doc
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