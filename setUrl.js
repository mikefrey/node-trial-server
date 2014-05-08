module.exports = function(port) {
  var en0 = require('os').networkInterfaces().en0
  var ip = en0.reduce(function(m, i) { return i.family=='IPv4' ? i.address : m })
  var addr = 'http://' + ip + (port == 80 ? '' : ':' + port)
  global.serverAddress = addr
}