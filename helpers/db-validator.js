const Role = require('../models/role')
const Usuario = require('../models/usuario')

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

module.exports = {
    roleValidator,
    existeEmail,
    existeUsuarioId
}