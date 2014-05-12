var net = require('net')
var thunkify = require('thunkify')
var co = require('co')

var wait = thunkify(function(ms, fn) { setTimeout(fn, ms) })

var addr

var server = net.createServer(function(socket) {
  console.log('Socket Connection Opened')
  socket.on('end', function() { console.log('Socket Connection Closed') })
  var data = trial.description.split('\n')
  data.forEach(co(function*(str) {
    socket.write(str)
    yield wait(50)
  }))
  socket.end()
})
server.listen(function() {
  addr = server.address()
})

var trial = {

  name: 'socket',
  stream: true,

  puzzle: function*() {
    return [ global.ip, addr.port ]
  },

  verify: function*(result, options) {
    return trial.description.replace(/\n/g, '').toUpperCase() == result.toString()
  },

  description: '\n\
Provide a function that takes three arguments, `ip`, `port` and `outStream`.\n\
Create a socket connection to the IP in the `ip` argument. Once connected,\n\
listen for data, pipe it through a transform stream, changing any lowercase\n\
letters to uppercase, then pipe the transformed data to `outStream`.\n\
\n\
Hint 1: Documentation for opening socket connections can be found here:\n\
http://nodejs.org/api/net.html\n\
\n\
Hint 2: You can use the `event-stream` module to easily transform data flowing\n\
through a stream. https://github.com/dominictarr/event-stream#through-write-end'

}

module.exports = trial


/** Solution

trials.add(function(ip, port, outStream) {
  var net = require('net')
  var through = require('through')
  var upper = through(function(data) {
    this.emit('data', data.toString().toUpperCase())
  })
  var socket = net.connect(port, ip)
  socket.pipe(upper).pipe(outStream)
})

*/
