
const mongoose = require('mongoose');

const dbConnection = async() =>{
    try {
        await mongoose.connect(process.env.URL_CONNECTION, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('Base de datos funcionando :)')
    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar a la base de datos :(')
    }
}

module.exports = {
    dbConnection
}