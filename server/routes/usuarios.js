/**
 * ADMINISTRACION DE LAS RUTAS DE LOS USUARIOS
 */
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("main")
});

app.get('/usuario', (req, res) => {
    res.send("getUsuario")
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok:false,
            msg: "Nombre necesario"
        })
    } else {
        res.json({body})
    }

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