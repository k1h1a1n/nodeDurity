var assert = require('chai').assert
var request = require('supertest')

describe('Claims', function () {
  describe('GET /api/claims', function () {
    it('should be returning claims', function (done) {
      request('localhost:3000/')
        .get('api/claims')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
