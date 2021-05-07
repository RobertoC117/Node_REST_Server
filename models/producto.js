const {Schema, model} = require('mongoose')

const ProductoSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'categorias',//Se pone a como tienes en la importacion del modelo de esa esquema
        required: true
    },
    precio:{
        type: Number,
        default: 0
    },
    descripcion:{
        type: String
    },
    disponible:{
        type: Boolean,
        default: true,
    }
})

ProductoSchema.methods.toJSON = function(){
    const {__v, _id, estado, ...producto} = this.toObject()
    producto.id = _id
    return producto;
}

module.exports = model('producto', ProductoSchema)