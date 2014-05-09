var crypto = require('crypto')

function* hash(key, team) {
  var hmac = crypto.createHmac('sha256', key)
  hmac.update(team)
  return hmac.digest('base64')
}

module.exports = {

  name: 'crypto',

  puzzle: function*() {
    return crypto.pseudoRandomBytes(32).toString('hex')
  },

  verify: function*(result, options) {
    return (yield hash(options, this.team)) == result
  },

  description: 'Provide a function that takes two arguments, `key` and `callback`.\n\
Generate a hmac hash of your team name using sha256 and the given key. Call the\n\
callback with the Base64 encoded hash as the result. Make sure you run the\n\
callback in the standard way, error first: `callback(err, result)`.'

}
