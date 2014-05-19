var crypto = require('crypto')

function getId() {
  return crypto.pseudoRandomBytes(4).toString('hex')
}

function urlToId(url) {
  try {
    var idx = url.lastIndexOf('/')
    url = url.substring(idx+1)
    return parseInt(url, 16)
  } catch (ex) {}
  return null
}

module.exports = {

  name: 'multi-get',

  route: {
    method: 'get',
    path: '/multi/:id',
    handler: function*(next) {
      this.body = parseInt(this.params.id, 16)
    }
  },

  puzzle: function*() {
    var count = 5 + Math.random()*5 | 0
    var urls = []
    for (var i = 0; i < count; i++) {
      urls.push(global.serverAddress + '/multi/' + getId())
    }
    return [ urls ]
  },

  verify: function*(result, options) {
    try {
      result = JSON.parse(result.toString())
    }
    catch (ex) {
      console.error(ex)
      return false
    }

    options = options[0].map(urlToId)
    if (options.length !== result.length) return false

    for (var i = 0; i < options.length; i++) {
      if (options[i] != result[i]) return false
    }
    return true
  },

  description: '\n\
Provide a function that takes two arguments, `urls` (array) and `callback`. Make an HTTP GET\n\
request to each url in the `urls` array, and place each response body result\n\
into a new array at the same position the request\'s url is in it\'s array.\n\
This is essentially an asynchronous version of `Array.prototype.map`. Invoke\n\
the callback with the resulting array (error first!).'

}

/** Solution

trials.add(function(urls, callback) {
  var http = require('http')
  var concat = require('concat-stream')

  var count = urls.length
  var results = []
  urls.forEach(function(url, idx) {
    http.get(url, function(res) {
      res.pipe(concat(function(data) {
        results[idx] = data.toString()
        count--
        if (!count) callback(null, results)
      }))
    })
  })
})

*/
