var crypto = require('crypto')
var zlib = require('zlib')
var thunkify = require('thunkify')
var gzip = thunkify(zlib.gzip)
var gunzip = thunkify(zlib.gunzip)

var cache = []
function* getMessage(id) {
  if (!cache[id])
    cache[id] = yield makeMessage()
  return cache[id]
}


var words
function randomWords(count) {
  if (!words) words = trial.description.split(/\s/)
  var msg = []
  while(msg.length < count) {
    var idx = (Math.random() * words.length-1)|0
    msg.push(words[idx])
  }
  return msg.join(' ')
}


function* makeMessage() {

  var msg = randomWords(50)
  var msgBuf = new Buffer(msg, 'utf8')
  var password = randomWords(5)

  var cipher = crypto.createCipher('aes256', password)
  var outBuf = Buffer.concat([cipher.update(msgBuf), cipher.final()])

  var zipped = yield(gzip(outBuf))

  return {
    message: msg,
    password: password,
    zipped: zipped
  }
}

function getId() {
  return (Math.random() * 50)|0
}

var trial = module.exports = {

  name: 'final',
  stream: true,

  route: {
    method: 'get',
    path: '/final/:cmd/:id',
    handler: function*(next) {
      var id = this.params.id
      var cmd = this.params.cmd
      if (cmd == 'password')
        this.body = (yield getMessage(id)).password
      else if (cmd == 'message')
        this.body = (yield getMessage(id)).zipped
    }
  },

  puzzle: function*() {
    var id = getId()
    return [
      global.serverAddress + '/final/password/' + id,
      global.serverAddress + '/final/message/' + id
    ]
  },

  verify: function*(result, options) {
    var id = options[0].match(/\d+$/)[0]
    var msg = (yield getMessage(id))

    var enc = yield(gunzip(result))
    var decipher = crypto.createDecipher('aes256', msg.password)
    var outBuf = Buffer.concat([decipher.update(enc), decipher.final()])

    var response = outBuf.toString('utf8')
    var expected = msg.message.replace(/[aeiou]/g, '')

    return response == expected
  },

  description: '\n\
Provide a function that takes three arguments, `passwordUrl` `messageUrl` and `outStream`.\n\
Make an HTTP GET request to passwordUrl to get the password that will allow\n\
you to decrypt the message you must retrieve from messageUrl. The message\n\
is gzipped and encrypted with aes256. You must ungzip and decrypt the message,\n\
remove any vowels (aeiou) the message contains, re-encrypt and gzip it before\n\
piping it to outStream.'

}

/** Solution

trials.add(function(passwordUrl, messageUrl, outStream) {
  var http = require('http')
  var zlib = require('zlib')
  var crypto = require('crypto')
  var through = require('through')
  var concat = require('concat-stream')

  http.get(passwordUrl, function(res) {
    res.pipe(concat(function(password) {
      http.get(messageUrl, function(res) {
        res.pipe(zlib.createGunzip())
           .pipe(crypto.createDecipher('aes256', password))
           .pipe(through(function(data) {
              this.emit('data', data.toString().replace(/[aeiou]/g, ''))
           }))
           .pipe(crypto.createCipher('aes256', password))
           .pipe(zlib.createGzip())
           .pipe(outStream)
      })
    }))
  })
})

*/
