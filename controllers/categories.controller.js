const bcrypt = require('bcrypt');
const { Categoria } = require('../models');

const crearCategoria = async (req, res) =>{

    try {
        
        const nombre = req.body.nombre.toUpperCase();
    
        const categoriaDB = await Categoria.findOne({nombre})
    
        if(categoriaDB){
            return res.status(400).json({
                ok:false,
                msg: `La categoria ${categoriaDB.nombre} ya existe  `
            })
        }
    
        //Generar la data a grabar
        const data = {
            nombre,
            usuario: req.usuarioAutenticado._id
        }
    
        const categoria = new Categoria(data)
        await categoria.save()
    
        res.status(201).json(categoria)

    } catch (error) {
        console.log(error)
    }

}

//Obtener categorias - paginado - total - populate
const obtenerCategorias = async(req, res) =>{
    try {
        let {salto = 0, limite = 5} = req.query
        salto = parseInt(salto);
        limite = parseInt(limite)

        let nuevo_salto = salto + limite
        let next = req.protocol + '://' + req.get('host') + '/api/categorias?salto=' + nuevo_salto + '&limite=' + limite;
        nuevo_salto = (salto - limite > 0) ? salto-limite : 0
        let previous = salto <= 0 ? null : req.protocol + '://' + req.get('host') + '/api/categorias?salto=' + nuevo_salto + '&limite=' + limite;

        // const categorias = await Categoria.find({estado:true}).skip(salto).limit(limite).populate('usuario')
        // const count = await Categoria.countDocuments({estado:true})

        const [categorias, count] = await Promise.all([
            Categoria.find({estado:true}).skip(salto).limit(limite).populate('usuario','nombre'),
            Categoria.countDocuments({estado:true})
        ])

        let respuesta = {
            ok:true,
            count,
            previous,
            next,
            data: categorias
        }
        res.status(201).json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, error})
    }
}

//Obtener categoria - populate
const buscarCategoria = async(req, res) =>{
    try {
        const {id} = req.params
        const categoria = await Categoria.findById(id).populate('usuario','nombre')
        res.json(categoria)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

//Actualizar categoria - nombre
const actualizarCategoria = async(req, res) =>{
    try {
        const {id} = req.params
        const nombre = req.body.nombre.toUpperCase()
        const usuario = req.usuarioAutenticado._id
        const data = {
            nombre,
            usuario
        }
        const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true, runValidators: true, context:'query'})
        res.status(201).json(categoria)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

//Eliminar categoria - estado: false
const eliminarCategoria = async(req, res) =>{
    try {
        const {id} = req.params
        const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true, runValidators: true, context:'query'})
        res.status(201).json(categoria)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    buscarCategoria,
    actualizarCategoria,
    eliminarCategoria
}