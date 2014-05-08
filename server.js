var koa = require('koa')
var body = require('koa-body')
var logger = require('koa-logger')
var router = require('koa-router')
var send = require('koa-send')
var trials = require('./trials')
require('colors')

var port = 3001

require('./setUrl')(port)

var app = koa(router(app))

app.use(logger())

app.use(trials([
  require('./trials/start'),
  require('./trials/http'),
  // require('./trials/reverse'),
  // require('./trials/gzip'),
  // require('./trials/crypto')
]))

app.listen(3001)

console.log('Trials Server started at %s', global.serverAddress.blue)
