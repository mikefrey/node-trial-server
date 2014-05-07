var koa = require('koa')
var body = require('koa-body')
var logger = require('koa-logger')
var router = require('koa-router')
var send = require('koa-send')
require('colors')

var app = koa(router(app))

app.use(logger())

app.use(trials([
  require('./trials/start'),
  require('./trials/reverse'),
  require('./trials/http'),
  require('./trials/gzip'),
  require('./trials/crypto')
]))

app.listen(3001)