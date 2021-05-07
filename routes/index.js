const express = require('express');
const app = express();

/**
 * Aqui se hacen las importaciones para posteriormente
 * solo hacer una en el archivo principal
 */

app.use(require('./login'))
app.use(require('./users'))
app.use(require('./categories'))
app.use(require('./products'))
app.use(require('./buscar'))

module.exports = app;