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

      it('should return a filtered list of chapters', function (done) {
        Promise.all([
          testHelper.createChapter(),
          testHelper.createChapter(),
          testHelper.createChapter()
        ]).then(newChapters => {
          const newChapter = newChapters[0]
          const newChapter2 = newChapters[1]
          request(server)
            .get('/chapters?ids=' + newChapter.id + ',' + newChapter2.id + ',' + (newChapter2.id + 99))
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
              models.Chapter.findAll().then(chapters => {
                expect(res.body.length).to.equal(2)
                const chapter = res.body[0]
                expect(chapter.id).to.deep.equal(newChapter.id)
                expect(chapter.title).to.deep.equal(newChapter.title)
                const chapter2 = res.body[1]
                expect(chapter2.id).to.deep.equal(newChapter2.id)
                expect(chapter2.title).to.deep.equal(newChapter2.title)
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

    describe('DELETE /destroy', function () {
      it('deletes a single chapter', function (done) {
        testHelper.createChapter().then(newChapter => {
          request(server)
            .delete(`/chapters/${newChapter.id}`)
            .set('Accept', 'application/json')
            .expect(204)
            .then(res => {
              expect(res.body).to.be.empty()
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
                expect(res.body).to.equal({ amount: amount })
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
