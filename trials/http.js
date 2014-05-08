module.exports = {

  name: 'http',

  route: { method: 'get', path: '/http/:num' },

  handler: function*(next) {
    this.body = this.path.replace('/http/', '').split('').reverse().join('')
  },

  puzzle: function*() {
    return global.serverAddress + '/http/' + ((Math.random() * 10000000)|0)
  },

  verify: function*(result, options) {
    return result == options
  },

  description: 'Make an http request to the provided url and run the callback with the result.'

}
