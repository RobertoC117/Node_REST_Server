const {Schema, model} = require('mongoose')

let CategoriaSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'nombre requerido']
    },
    estado:{
        type: Boolean,
        default: true,
        required: [true, 'el estado es requerido']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function(){
    const {__v, _id, estado, ...categoria} = this.toObject()
    categoria.id = _id
    return categoria;
}


module.exports = model('categorias', CategoriaSchema)