'use strict'

var SwaggerRestify = require('swagger-restify-mw')
var restify = require('restify')
var app = restify.createServer()

var debug = require('debug')('afeefa-wisdom-api')
var path = require('path')
var config = require(path.join(__dirname, 'config/config.json'))

module.exports = app // for testing

var swaggerConfig = {
  appRoot: __dirname // required config
}

app.on('NotFound', function (req, res, err, cb) {
  // do not call res.send! you are now in an error context and are outside
  // of the normal next chain. you can log or do metrics here, and invoke
  // the callback when you're done. restify will automtically render the
  // NotFoundError depending on the content-type header you have set in your
  // response.
  console.log('not found triggered')

  return cb()
})

app.on('restifyError', function (req, res, err, cb) {
  // this listener will fire after both events above!
  // `err` here is the same as the error that was passed to the above
  // error handlers.
  console.log('general error triggered')

  return cb()
})

SwaggerRestify.create(swaggerConfig, function (err, swaggerRestify) {
  if (err) {
    console.log('error was detected')

    throw err
  }

  swaggerRestify.register(app)

  // ////////
  // maybe we should use this //
  // ///////

  // Errors sent to next(err) get swallowed if this
  // isn't here.
  //
  // Issues:
  // * No err object on 404
  app.on('after', function (req, res, route, err) {
    console.log('==== after', route, err)
    err = err || {}

    if (err.status <= 399 && err.status >= 500) {
      process.nextTick(process.exit(1))
    }

    // Don't try to send headers twice -- you don't
    // have to worry about this in Express error
    // handlers.
    if (!res.headersSent) {
      res.send(200, { handler: 'after' })
    }
    // handleError(req, res, route, err)
  })

  // This is necessary for everything that isn't
  // route / middleware related.
  process.on('uncaughtException', function (err) {
    console.log('==== process uncaughtException')
    err = err || {}
    console.log('======== ', arguments)
    if (!(err.status >= 400 && err.status <= 499)) {
      process.nextTick(process.exit(1))
    }
  })

  // ////////
  // END OF maybe we should use this //
  // ////////

  app.on('error', onError)
  app.on('listening', onListening)
  var port = process.env.PORT || config.app_port
  app.listen(port)
})

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var port = config.app_port
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

function onListening () {
  var addr = app.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
