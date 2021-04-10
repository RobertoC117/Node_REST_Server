const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')//Modelo de Usuario
const _ = require('underscore');//En si la libreria cotiene mas funciones para facilitarte trabajar con estructuras de datos

const getUsers = (req, res) =>{
    //Se manejan parametros opcionales que se almacenan en el objeto query de la peticion(pueden o no existir)
    //Estos parametros son los que vienen explicitamente en la URL
    //RECUPERACION DEL PARAMETRO SALTO Y VALIDACION
    let salto = req.query.salto || 0;
    salto = parseInt(salto);
    salto = isNaN(salto) ? 0 : (salto > 0) ? salto : 0 

    //RECUPERACION DEL PARAMETRO LIMITE Y VALIDACION
    let limite = req.query.limite || 5;
    limite = parseInt(limite);
    limite = isNaN(limite) ? 5 : (limite > 0) ? limite : 5

    //LOGICA DE PROPIEDADES NETX Y PREVIOUS QUE IRAN EN LA RESPUESTA
    let nuevo_salto = salto + limite;
    let next = req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto + '&limite=' + limite;

    nuevo_salto = (salto - limite > 0) ? salto-limite : 0
    let previous = salto === 0 ? null : req.protocol + '://' + req.get('host') + '/api/usuario?salto=' + nuevo_salto  + '&limite=' + limite;

    let respuesta = {ok: true, count: null, previous, next, data: null}
    Usuario.find({estado: true})
                .skip(salto)//El tamaño del salto
                .limit(limite)//Numero de registros que mostrara
                .then(data => {
                    respuesta.data = data;
                    return Usuario.countDocuments({estado: true});
                })
                .then(count =>{
                    respuesta.count = count;
                    res.json(respuesta)
                })
                .catch(err => {
                    res.status(400).json({ok:false, err})
                })
}

const createUser = (req, res) =>{

    //Obtiene las propiedades del cuerpo de la peticion
    const {nombre, email, password, role} = req.body;

    //Cantidad de vueltas para encriptar la contraseña, por defecto es 10
    const salt = bcrypt.genSaltSync();

    //Crea un nuevo objeto del modelo
    let usuario = new Usuario({
        nombre: nombre,
        email: email,
        password: bcrypt.hashSync(password, salt),
        role: role,
    });

    usuario.save()
    .then(usuarioDB => {
        res.json({
            ok: true,
            data: usuarioDB
        })
    })
    .catch(err => {
        res.status(400).json({
            ok: false,
            err,
        });
    })
}

const updateUser = (req, res) =>{

    const {id} = req.params;

    //Validacion filtra del objeto que se le pasa las propiedades permitidas por el arreglo 
    //para evitra que actualicen la contraseña y otros datos que no deben ser cambiados desde esta seccion
    //la variable resto es un objeto con las demas propiedades que no son las extraidas en esa misma linea
    const {_id, password, google, estado, correo, ...resto} = req.body;

    //Identifica si se desea actualizar la contraseña, es decir si viene en el cuerpo de la peticion
    //de ser asi se encripta para actualizarla
    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    //La propiedad context:'query' se usa por razones tecnicas ya que al parecer mongoose-unique-validator 
    //no corre automaticamente las validaciones al actualizar
    Usuario.findByIdAndUpdate(id, resto, {new: true, runValidators: true, context:'query'})
    .then(doc => {
        res.json({
            ok: true,
            data: doc
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({
            ok: false,
            err,
        })
    })
}

const deleteUser = (req, res) =>{
    let {id} = req.params;
    let usuarioAutenticado =  req.usuarioAutenticado;
    //Busca el usuario por el ID
    Usuario.findById(id, ['estado'])
    .then((data) => data.estado)
    .then((estado) => {//Si su estado el falso entonces se supone que ya no existe y no se debe acceder a el, se lanza un error
        if(!estado)
            throw new Error('Ups!, Usuario no encontrado')
        //Si es true entonces existe por lo que se podra inhabilitar
        return Usuario.findByIdAndUpdate(id, {estado:false}, {new: true})
    })
    .then((data) =>{
        //Se devuelve el objeto que se elimino
        res.json({
            ok: true,
            data,
            usuarioAutenticado
        })
    })
    .catch(err => {
        res.status(400).json({
            ok: false,
            err: {
                message: err.message,
                ...err
            }
        })
    })
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}