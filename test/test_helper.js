'use strict'

process.env.NODE_ENV = 'test'

var chai = require('chai')
global.assert = chai.assert
global.expect = chai.expect

var models = require('../models')
global.models = models
var sequelize = models.sequelize

module.exports = {
  createChapter (attributes = {}) {
    return models.Chapter.create({
      title: attributes.title || 'Neues Chapter'
    })
  },

  assertPromiseError (promise, done, errorCallback) {
    promise.then(result => {
      done(new Error('Promise should not succeed with result: ' + result))
    }).catch(error => {
      errorCallback(error)
      done()
    })
  },

  truncateTables (modelsToTruncate) {
    return sequelize.transaction(t => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: t})
        .then(() => {
          const promises = []
          modelsToTruncate.forEach(model => {
            promises.push(model.destroy({
              truncate: true, transaction: t
            }))
          })
          return Promise.all(promises)
        })
        .then(() => {
          return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: t})
        })
    })
  },

  dbSetup (beforeEach, after) {
    beforeEach(done => {
      this.truncateTables([
        models.Chapter
      ]).then(() => {
        done()
      })
    })
    after(done => {
      models.sequelize.close()
      done()
    })
  }
}
