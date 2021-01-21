/**
 * SERVER
 */

//IMPORTACIONES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');//Ya no es necesario express cubre la funcionaidad de esta libreria

const app = express();

//ARCHIVO DE CONFIGURACION
require('./config/config');

/**
 * FIXME: Por arreglar falta:
 * La validacion de id cuando se recibe como parametro, evitar castError
 * Evitar devolver la passwd en las respuestas, sin utilizar el metodo que lo elimina del objeto cada que lo parseamos a JSON
 * Hacer los hasheos y demas metodos de bcrypt asincronos(por recomendacion del desarrollador)
 */

//MIDDLEWARES

//Middleware que decodifica los formularios(en este caso application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended:false}))
//Analiza las solicitudes entrantes con cargas útiles JSON (application/json)
app.use(bodyParser.json());

//ARCHIVO DE RUTAS
//Requerimos el archivo de rutas y le indicamos por medio de que direccion se debe acceder
//en este caso seria localhost:3000/api/<ruta>
app.use('/api', require('./routes/index'))

mongoose.connect(process.env.URL_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    console.log("Connected :)");
})
.catch((err)=>{
    console.log(err)
});

app.listen(process.env.PORT ,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})