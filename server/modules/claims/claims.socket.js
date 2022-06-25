var claims = require('./claims.controller.js')

module.exports = function (io, socket) {
  socket.on('claims', claims.onClaims(io, socket))
}