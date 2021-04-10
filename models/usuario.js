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
        default: 'USER_ROLE',//Valor por defecto
        enum:{
            values: ['ADMIN_ROLE', 'USER_ROLE'],
            message: '{VALUE} no es un role valido'
        }
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

//Editamos el metodo toJSON ahora cada que se parsea a JSON se ejecuta este metodo
//normalmente se ejecuta al mandar un objeto de este esquema en la respuesta del servidor
//saca las propiedades __v y password y retorna las demas propiedades
UsuarioSchema.methods.toJSON =  function(){
    const {__v, password, _id, ...usuario} = this.toObject()
    //se cambia de manera visible el nombre de la propiedad que contiene el id que proviene de la DB
    usuario.uid = _id;
    return usuario
}

//indicamos que use el plugin "uniqueValidator"
UsuarioSchema.plugin(uniqueValidator)

//el nombre de tu modelo debe ser el mismo nombre de la coleccion que afectará en este caso "usuarios"
module.exports = mongoose.model('usuarios', UsuarioSchema)