/**
 * ESQUEMA Y MODELO DE LOS USUARIOS
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Referencia a la clase Schema
let Schema = mongoose.Schema;

//Creacion del objeto de la clase, configuracion del Schema (lo puedes encontrar como SchemaType en la doc.)
let UsuarioSchema = new Schema({
    nombre:{
        type: String,//Tipo de dato
        required: [true, 'El nombre es necesario'],//Para manejar mejor los errores
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type: String,
        enum:{
            values: ['ADMIN_ROLE, USER_ROLE'],
            message: '{VALUE} no es un role valido'
        },
        default: 'USER_ROLE'//Valor por defecto
    },
    estado:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Usuario', UsuarioSchema)