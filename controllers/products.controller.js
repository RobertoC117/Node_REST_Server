const { Producto } = require("../models");

const obtenerProductos = async(req, res) =>{
    try {
        let {salto = 0, limite = 5} = req.query
        salto = parseInt(salto);
        limite = parseInt(limite)

        let nuevo_salto = salto + limite
        let next = req.protocol + '://' + req.get('host') + '/api/categorias?salto=' + nuevo_salto + '&limite=' + limite;
        nuevo_salto = (salto - limite > 0) ? salto-limite : 0
        let previous = salto <= 0 ? null : req.protocol + '://' + req.get('host') + '/api/categorias?salto=' + nuevo_salto + '&limite=' + limite;
        
        const [data, count] = await Promise.all([
            Producto.find({estado:true}).skip(salto).limit(limite).populate('usuario','nombre').populate('categoria','nombre'),
            Producto.countDocuments({estado:true})
        ])

        let respuesta = {
            ok:true,
            count,
            previous,
            next,
            data,
        }

        res.status(201).json(respuesta)

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const buscarProducto = async(req, res) =>{
    try {
        const {id} = req.params
        const producto = await Producto.findOne({_id:id, estado:true}).populate('usuario', 'nombre').populate('categoria','nombre')
        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const crearProducto = async(req, res) =>{
    try {
        let {nombre, precio, descripcion, categoria, disponible} = req.body
        let usuario = req.usuarioAutenticado._id
        let data = {
            nombre,
            precio,
            descripcion,
            categoria,
            disponible,
            usuario,
        }

        let producto =  new Producto(data)

        await producto.save()

        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const actualizarProducto = async(req, res) =>{
    try {
        const {id} = req.params
        const {_id, estado, __v, ...data} = req.body
        const usuario = req.usuarioAutenticado._id
        const producto = await Producto.findByIdAndUpdate(id, data, {new: true, runValidators: true, context:'query'})
        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const eliminarProducto = async(req, res) =>{
    try {
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id,{estado: false},{new: true})
        res.json(producto)
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
}

module.exports = {
    obtenerProductos,
    buscarProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}