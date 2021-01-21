const express = require('express');
const app = express();

/**
 * Aqui se hacen las importaciones para posteriormente
 * solo hacer una en el archivo principal
 */

app.use(require('./login'))
app.use(require('./usuarios'))

module.exports = app;