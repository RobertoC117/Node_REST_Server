/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */
const express = require('express');
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuarios')//Modelo de Usuario
const _ = require('underscore');//En si la libreria cotiene mas funciones para facilitarte trabajar con estructuras de datos
const app = express();

//FIXME: Falta validar la recepcion de id como parametros para evitar el castError TODAS LAS RUTAS

app.get('/', (req, res) => {
    res.send("main")
});

app.get('/usuario', (req, res) => {

    //Se manejan parametros opcionales que se almacenan en el objeto query de la peticion(pueden o no existir)
    //RECUPERACION DEL PARAMETRO SALTO Y VALIDACION
    let salto = req.query.salto || 0;
    salto = parseInt(salto);
    salto = isNaN(salto) ? 0 : (salto > 0) ? salto : 0 //Es igual al ejemplo de abajo que esta comentado

    //RECUPERACION DEL PARAMETRO LIMITE Y VALIDACION
    let limite = req.query.limite || 5;
    limite = parseInt(limite);
    limite = isNaN(limite) ? 5 : (limite > 0) ? limite : 5

    //LOGICA DE PROPIEDADES NETX Y PREVIOUS QUE IRAN EN LA RESPUESTA
    let nuevo_salto = salto + limite;
    let next = req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto + '&limite=' + limite;

    nuevo_salto = (salto - limite > 0) ? salto-limite : 0
    let previous = salto === 0 ? null : req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto  + '&limite=' + limite;

    let respuesta = {ok: true, count: null, previous, next, data: null}
    Usuario.find({estado: true})
                .skip(salto)//El tamaño del salto
                .limit(limite)//Numero de registros que mostrara
                .then(data => {
                    respuesta.data = data;
                    return Usuario.count({estado: true});
                })
                .then(count =>{
                    respuesta.count = count;
                    res.json(respuesta)
                })
                .catch(err => {
                    res.status(400).json({ok:false, err})
                })

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

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //Busca el usuario por el ID
    Usuario.findById(id, ['estado'])
    .then((data) => data.estado)
    .then((estado) => {//Si su estado el falso entonces se supone que ya no existe y no se debe acceder a el, se lanza un error
        if(!estado)
            throw new Error('Ups!, Usuario no encontrado')
        //Si es true entonces existe por lo que se podra eliminar
        return Usuario.findByIdAndUpdate(id, {estado:false}, {new: true})
    })
    .then((data) =>{
        //Se devuelve el objeto que se elimino
        res.json({
            ok: true,
            data,
        })
    })
    .catch(err => {
        res.status(400).json({
            ok: false,
            err: {
                message: err.message,
                ...err
            }
        })
    })
});

module.exports = app;