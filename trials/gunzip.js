var crypto = require('crypto')
var zlib = require('zlib')
var thunkify = require('thunkify')
var gzip = thunkify(zlib.gzip)

var cache = []
function* getGzip(id) {
  if (!cache[id]) {
    var txt = crypto.pseudoRandomBytes(256).toString('hex')
    cache[id] = {
      txt: txt,
      bin: yield gzip(txt)
    }
  }
  return cache[id]
}

function getId() {
  return (Math.random() * 50)|0
}

module.exports = {

  name: 'gunzip',
  stream: true,

  route: {
    method: 'get',
    path: '/gunzip/:id',
    handler: function*(next) {
      this.body = (yield getGzip(this.params.id)).bin
    }
  },

  puzzle: function*() {
    return global.serverAddress + '/gunzip/' + getId()
  },

  verify: function*(result, options) {
    var id = options.match(/\d+$/)[0]
    return (yield getGzip(id)).txt == result
  },

  description: '\n\
Provide a function that takes two arguments, `url` and `outStream`.\n\
Make an HTTP GET request to the given url which will respond with a gzipped\n\
text file. Gunzip the text file and pipe it\'s contents to `outStream`.\n\
(Hint: check out the zlib documentation in Node core.)'

}

/** Solution

trials.add(function(url, outStream) {
  var http = require('http')
  var zlib = require('zlib')
  http.get(url, function(res) {
    res.pipe(zlib.createGunzip()).pipe(outStream)
  })
})

*/
