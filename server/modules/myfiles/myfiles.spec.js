var assert = require('chai').assert
var request = require('supertest')

describe('Myfiles', function () {
  describe('GET /api/myfiles', function () {
    it('should be returning myfiles', function (done) {
      request('localhost:3000/')
        .get('api/myfiles')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
