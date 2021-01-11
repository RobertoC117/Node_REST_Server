const express = require('express');
const app = express();

require('./config/config');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:false}))//Middleware que decodifica los formularios(en este caso application/x-www-form-urlencoded)
app.use(bodyParser.json());//Analiza las solicitudes entrantes con cargas útiles JSON (application/json)

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

app.listen(process.env.PORT ,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})