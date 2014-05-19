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

// app.use(logger())
app.use(router(app))

trials(app, [
  require('./trials/start'),
  require('./trials/http-get'),
  require('./trials/multi-get'),
  require('./trials/crypto'),
  require('./trials/gunzip'),
  require('./trials/socket'),
  require('./trials/http-server'),
  require('./trials/final')
])

app.listen(3001)

console.log('Trials Server started at %s', global.serverAddress.blue)
