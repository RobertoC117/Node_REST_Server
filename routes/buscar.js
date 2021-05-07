const {Router} = require('express')
const { buscar } = require('../controllers/buscar.controller')

const router = Router()

router.get('/buscar/:collection/:termino', [

], buscar)

module.exports = router