var assert = require('chai').assert
var request = require('supertest')

describe('Hello', function () {
  describe('GET /api/hello', function () {
    it('should be returning hello', function (done) {
      request('localhost:3000/')
        .get('api/hello')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
