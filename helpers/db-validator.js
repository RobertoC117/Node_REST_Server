const Role = require('../models/role')
const {Usuario, Categoria} = require('../models')

//#region VALIDACIONES USUARIO
//verifica si el rol que se ingresa esta registrado en la DB (create, update)
const roleValidator = (role='') => {
    return Role.findOne({role}).then(exist =>{
        if(!exist)
            return Promise.reject(`El role ${role} no esta registrado en la base de datos`)
    })
}

//Verifica si el email que se ingresa ya esta registrado en la db (create)
const existeEmail = (email='') =>{
    return Usuario.findOne({email}).then(exist =>{
        if(exist)
            return Promise.reject(`El email ${email} ya esta registrado`)
    })
}

//Verifica si existe un usuario con el id ingresado (update, delete)
const existeUsuarioId = (id = '') =>{
    return Usuario.findById(id).then(exist =>{
        if(!exist)
            return Promise.reject(`El id ${id} no existe`)
    })
}
//#endregion

//#region VALIDACIONES CATEGORIAS
const existeCategoria = (id = '') =>{
    return Categoria.findById(id).then(categoria =>{
        if(!categoria)
            return Promise.reject(`La categoria con el id ${id} no existe`)
    })
}

const existeNombreCategoria = (nombre) =>{
    nombre = nombre.toUpperCase()
    return Categoria.findOne({nombre}).then(res =>{
        if(res)
            return Promise.reject(`La categoria ${nombre} ya existe`)
    })
}
//#endregion
module.exports = {
    roleValidator,
    existeEmail,
    existeUsuarioId,
    existeCategoria,
    existeNombreCategoria
}