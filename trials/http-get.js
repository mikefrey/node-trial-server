var crypto = require('crypto')

function reverse(str) {
  return str.split('').reverse().join('')
}

function getId() {
  return crypto.pseudoRandomBytes(4).toString('hex')
}

module.exports = {

  name: 'http.get',

  route: {
    method: 'get',
    path: '/http/:id',
    handler: function*(next) {
      this.body = reverse(this.params.id)
    }
  },

  puzzle: function*() {
    return global.serverAddress + '/http/' + getId()
  },

  verify: function*(result, options) {
    return reverse(options).indexOf(result) == 0
  },

  description: 'Provide a function that takes two arguments, `url` and `callback`. Make an HTTP\n\
GET request to the provided url and run the callback with the response body of\n\
the request. Make sure you run the callback in the standard way, error first:\n\
`callback(err, result)`. '

}
