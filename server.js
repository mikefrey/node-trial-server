var koa = require('koa')
var body = require('koa-body')
var logger = require('koa-logger')
var router = require('koa-router')
var send = require('koa-send')
var trials = require('./trials')
require('colors')

var port = 3001

require('./setUrl')(port)

var app = koa()

app.use(logger())
app.use(router(app))

trials(app, [
  require('./trials/start'),
  require('./trials/http-get'),
  require('./trials/crypto'),
  // require('./trials/http-post'),
  // require('./trials/async'), // make several reqeusts and reassemble in the correct order
  require('./trials/gunzip'), // unzip a file to be used in later trials.
  // require('./trials/usefile'),
  require('./trials/socket')
])

app.listen(3001)

console.log('Trials Server started at %s', global.serverAddress.blue)


// turn callbacks into writeable/readable streams so
// results can be streamed to the callback.