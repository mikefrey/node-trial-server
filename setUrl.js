var en0 = require('os').networkInterfaces().en0
global.ip = en0.reduce(function(m, i) { return i.family=='IPv4' ? i.address : m })

module.exports = function(port) {
  var addr = 'http://' + global.ip + (port == 80 ? '' : ':' + port)
  global.serverAddress = addr
}