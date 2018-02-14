'use strict'
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var restify = require('restify')
var models = require('../../models')

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  meta: meta,
  index: index,
  show: show,
  create: create,
  update: update,
  delete: destroy
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function index (req, res, next) {
  let ids = req.swagger.params.ids.value
  let query = {}
  if (ids) {
    ids = ids.split(',')
    query = { where: { id: ids } }
  }
  models.Chapter.findAll(query).then(chapters => {
    if (chapters) {
      // https://github.com/swagger-api/swagger-node/issues/313#issuecomment-217765835 awkward
      res.header('content-type', 'application/json')
      res.end(chapters)
    } else {
      const err = new restify.errors.NotFoundError()
      next(err)
    }
  }).catch(err => {
    next(err)
  })
}

function show (req, res, next) {
  models.Chapter.findById(req.swagger.params.id.value).then(chapter => {
    if (chapter) {
      res.json(chapter)
    } else {
      const err = new restify.errors.NotFoundError()
      next(err)
    }
  }).catch(err => {
    next(err)
  })
}

function create (req, res, next) {
  models.Chapter.create(req.swagger.params.body.value).then(chapter => {
    res.json(201, chapter)
  }).catch(err => {
    next(err)
  })
}

function update (req, res, next) {
  models.Chapter.findById(req.swagger.params.id.value).then(chapter => {
    if (chapter) {
      chapter.update(req.swagger.params.body.value).then(updatedChapter => {
        res.json(updatedChapter)
      }).catch(err => {
        next(err)
      })
    } else {
      const err = new restify.errors.NotFoundError()
      next(err)
    }
  }).catch(err => {
    next(err)
  })
}

function destroy (req, res, next) {
  models.Chapter.findById(req.swagger.params.id.value).then(chapter => {
    if (chapter) {
      chapter.destroy().then(updatedChapter => {
        res.send(204)
      }).catch(err => {
        next(err)
      })
    } else {
      const err = new restify.errors.NotFoundError()
      next(err)
    }
  }).catch(err => {
    next(err)
  })
}

function meta (req, res, next) {
  models.Chapter.count().then(amount => {
    res.header('content-type', 'application/json')
    res.json({ amount: amount })
  }).catch(err => {
    next(err)
  })
}
