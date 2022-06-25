var assert = require('chai').assert
var request = require('supertest')

describe('Test', function () {
  describe('GET /api/Test', function () {
    it('should be returning Test', function (done) {
      request('localhost:3000/')
        .get('api/Test')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
