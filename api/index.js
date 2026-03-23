const path = require('path');
const { crearVercelServer } = require(path.join(__dirname, '..', 'dist', 'vercelHandler'));

module.exports = crearVercelServer();
