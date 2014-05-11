var crypto = require('crypto')
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
    return trial.description.replace(/\n/g, '').toUpperCase() == result
  },

  description: '\n\
Provide a function that takes three arguments, `ip`, `port` and `outStream`.\n\
Create a socket connection to the IP in the `ip` argument. Once connected,\n\
listen for data, pipe it through a transform stream, changing any lowercase\n\
letters to uppercase, then pipe the transformed data to `outStream`\n\
\n\
Hint: You can use the `event-stream` module to easily transform the data\n\
flowing through the stream from the socket connection.\n\
https://github.com/dominictarr/event-stream#through-write-end'

}

module.exports = trial


/** Solution

trials.add(function(ip, port, outStream) {
  var net = require('net')
  var es = require('event-stream')
  var upper = es.through(function(data) {
    this.emit('data', data.toString().toUpperCase())
  })
  var socket = net.connect(port, ip)
  socket.pipe(upper).pipe(outStream)
})

*/