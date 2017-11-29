var should = require('should')
var request = require('supertest')
var server = require('../../../app')

var testHelper = require('../../test_helper')

describe('controllers', function () {
  describe('chapters', function () {
    describe('GET /chapters', function () {
      it('should return a list of chapters', function (done) {
        request(server)
          .get('/chapters')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err)

            res.body.should.eql('[]')

            done()
          })
      })

      it('should accept a name parameter', function (done) {
        request(server)
          .get('/chapters')
          .query({ name: 'Scott' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err)

            res.body.should.eql('Hello, Scott!')

            done()
          })
      })
    })

    describe('GET /show', function () {
      it('returns a single chapter', function (done) {
        testHelper.createChapter().then(newChapter => {
          request(server)
            .get(`/chapters/${newChapter.id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              should.not.exist(err)

              const chapter = res.body
              expect(chapter.title).to.equal(newChapter.title)
              expect(chapter.id).to.equal(newChapter.id)

              done()
            })
        })
      })
    })
  })
})
