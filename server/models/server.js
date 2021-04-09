const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config')

class Server{
    
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        //Conectar base de datos
        this.ConnectDB()
        //Middlewares
        this.middlewares()
        //Rutas
        this.routes()
    }

    async ConnectDB(){
        await dbConnection()
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Listening port:", this.port)
        })
    }

    middlewares(){
        this.app.use(cors())
        //Middleware que decodifica los formularios de datos (en este caso application/x-www-form-urlencoded)
        this.app.use(express.urlencoded({ extended:false}))
        //Analiza las solicitudes entrantes con cargas útiles JSON (application/json)
        this.app.use(express.json());
    }

    routes(){
        //Archivo de rutas
        this.app.use('/api', require('../routes/index'))
    }

}

module.exports = Server