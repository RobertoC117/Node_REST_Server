const {ObjectId} = require('mongoose').Types
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async(termino = '', res) =>{
    try {
        const esMongoId = ObjectId.isValid(termino)
        
        if(esMongoId){
            const usuario = await Usuario.findById(termino)
            return res.json({
                result: usuario ? [usuario] : []
            })
        }

        console.log('nombre')
        const regex = new RegExp(termino, 'i')
        const usuarios = await Usuario.find({
            $or: [{nombre: regex}, {email:regex}], 
            $and:[{estado:true}]
        })
        return res.json({
            result: usuarios ? usuarios : []
        })

    } catch (error) {
        console.log(error)
    }
}

const buscarCategoria = async(termino = '', res) =>{
    try {
        const esMongoId = ObjectId.isValid(termino)
        
        if(esMongoId){
            const categoria = await Categoria.findById(termino)
            return res.json({
                result: categoria ? [categoria] : []
            })
        }

        console.log('nombre')
        const regex = new RegExp(termino, 'i')
        const categorias = await Categoria.find({nombre: regex, estado: true})
        return res.json({
            result: categorias ? categorias : []
        })
    } catch (error) {
        console.log(error)
    }
}

const buscarProducto = async(termino = '', res) =>{
    try {
        const esMongoId = ObjectId.isValid(termino)
        
        if(esMongoId){
            const producto = await Producto.findById(termino).populate('categoria','nombre').populate('usuario','nombre')
            return res.json({
                result: producto ? [producto] : []
            })
        }

        console.log('nombre')
        const regex = new RegExp(termino, 'i')

        const productos = await Producto.find({
            $or:[{nombre: regex}],
            $and:[{estado: true}]
        }).populate('categoria','nombre')
        .populate('usuario','nombre')

        return res.json({
            result: productos ? productos : []
        })
    } catch (error) {
        console.log(error)
    }
}

const buscar = async(req, res) =>{
    const {collection, termino} = req.params
    if(!coleccionesPermitidas.includes(collection)){
        return res.status(400).json({
            msg: `Las colecciones permitidad son: ${coleccionesPermitidas}`
        })
    }

    switch (collection) {
        case 'usuarios':
            buscarUsuario(termino, res)
            break;
        case 'categorias':
            buscarCategoria(termino, res)
            break;
        case 'productos':
            buscarProducto(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }


    // res.json({
    //     collection,
    //     termino
    // })
}

module.exports = {
    buscar
}