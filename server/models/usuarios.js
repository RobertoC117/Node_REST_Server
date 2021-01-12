const mongoose = require('mongoose');

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
        default: 'USER'//Valor por defecto
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

module.exports = mongoose.model('Usuario', UsuarioSchema)