var request = require('supertest')
var server = require('../../../app')

var testHelper = require('../../test_helper')

describe('controllers', function () {
  describe('chapters', function () {
    describe('GET /chapters', function () {
      it('should return an empty list of chapters', function (done) {
        request(server)
          .get('/chapters')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal([])
            done()
          }).catch(err => {
            done(err)
          })
      })

      it('should return a list of chapters', function (done) {
        testHelper.createChapter().then(newChapter => {
          request(server)
            .get('/chapters')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
              models.Chapter.findAll().then(chapters => {
                expect(res.body.length).to.equal(1)
                const chapter = res.body[0]
                const newChapter = chapters.pop().get()
                expect(chapter.id).to.deep.equal(newChapter.id)
                expect(chapter.title).to.deep.equal(newChapter.title)
                done()
              })
            }).catch(err => {
              done(err)
            })
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
            .then(res => {
              const chapter = res.body
              expect(chapter.title).to.equal(newChapter.title)
              expect(chapter.id).to.equal(newChapter.id)
              done()
            }).catch(err => {
              done(err)
            })
        })
      })
    })

    describe('GET /meta', function () {
      it('returns the amount of chapters', function (done) {
        testHelper.createChapter().then(newChapter => {
          request(server)
            .get(`/chapters/meta`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
              models.Chapter.count().then(amount => {
                expect(res.body).to.equal(amount)
              })
              done()
            }).catch(err => {
              done(err)
            })
        })
      })
    })
  })
})
