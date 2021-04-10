/**
 * FIXME: Por arreglar falta:
 * La validacion de id cuando se recibe como parametro, evitar castError
 * Hacer los hasheos y demas metodos de bcrypt asincronos(por recomendacion del desarrollador)
 */
/**
 * SERVER
 */

//IMPORTACIONES NODE
const dotenv = require('dotenv')

//IMPORTACIONES PROPIAS
const Server = require('./models/server')

//Creacion variables de entorno
dotenv.config({path:__dirname + '/config/.env'})

//Levantamiento del server
const server = new Server()
server.listen()
