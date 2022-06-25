var assert = require('chai').assert
var request = require('supertest')

describe('Editor', function () {
  describe('GET /api/editor', function () {
    it('should be returning editor', function (done) {
      request('localhost:3000/')
        .get('api/editor')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
