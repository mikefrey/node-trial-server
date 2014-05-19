var http = require('http')
var thunkify = require('thunkify')
// var co = require('co')
var es = require('event-stream')

var wait = thunkify(function(ms, fn) { setTimeout(fn, ms) })
var request = thunkify(http.request)

var port = 3009

var trial = {

  name: 'http-server',

  puzzle: function*() {
    return port
  },

  verify: function*(result, options) {
    var remoteAddr = this.socket.remoteAddress

    // this block is pretty gross relative to the co workflow
    // It could use some refactoring once I figure out how to
    // properly use http.request with co.
    var response = yield function(callback) {
      var opts = { method:'POST', hostname: remoteAddr, port: port }
      try {
        var req = http.request(opts, function(res) {
          try {
            res.pipe(es.wait(function(err, data) {
              callback(null, data.toString())
            }))
          } catch(ex) {}
        })
        req.end(trial.description)
      } catch(ex) {}
    }

    return response == trial.description
  },

  description: '\n\
Provide a function that takes two arguments, `port` and `callback`.\n\
Create an HTTP server running on the given `port`. Echo back any requests sent\n\
to the sever you create. Once your server has been started, run the callback.\n\
\n\
Note: If you are running a firewall, you may need to allow incoming connections\n\
to port ' + port + ' for a limited time. The trials server will attempt to\n\
connect to the server during the verify step.'

}

module.exports = trial


/** Solution

trials.add(function(port, callback) {
  var http = require('http')
  var server = http.createServer(function(req, res) {
    req.pipe(res)
    res.on('finish', function() { server.close() })
  }).listen(port, callback)
})

*/
