const { Schema, model } = require('mongoose')

const RoleSchema = new Schema({
    role:{
        type: String,
        required: [true, 'El nombre del role es necesario'] 
    },
})

module.exports = model('roles', RoleSchema)