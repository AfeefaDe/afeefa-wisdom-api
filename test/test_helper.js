'use strict'

process.env.NODE_ENV = 'test'

var chai = require('chai')
global.assert = chai.assert
global.expect = chai.expect

var db = require('../models')

module.exports = {
  createChapter (attributes = {}) {
    return db.Chapter.create({
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

  after (after, closeConnection, timeout) {
    console.log('outer')
    after(() => setTimeout(() => {
      console.log('inner')
      Promise.all([
        db.Chapter.destroy({
          where: {},
          truncate: true
        })
      ]).then(() => {
        if (closeConnection) {
          db.sequelize.close()
        }
      })
    }, timeout))
  }
}
