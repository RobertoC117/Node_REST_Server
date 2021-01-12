/**
 * SERVER
 */

//IMPORTACIONES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//ARCHIVO DE CONFIGURACION
require('./config/config');

/**
 * MIDDLEWARES
 */

//Middleware que decodifica los formularios(en este caso application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended:false}))
//Analiza las solicitudes entrantes con cargas útiles JSON (application/json)
app.use(bodyParser.json());
//ARCHIVO DE RUTAS
app.use(require('./routes/usuarios'))

mongoose.connect('mongodb://localhost:27017/cafe', {useNewUrlParser: true, useUnifiedTopology: true} ,(err) =>{
    if(err) throw err;  

    console.log('Conectado :)')
});

app.listen(process.env.PORT ,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})