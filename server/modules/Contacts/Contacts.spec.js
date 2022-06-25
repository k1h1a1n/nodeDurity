var assert = require('chai').assert
var request = require('supertest')

describe('Contacts', function () {
  describe('GET /api/Contacts', function () {
    it('should be returning Contacts', function (done) {
      request('localhost:3000/')
        .get('api/Contacts')
        .expect(200, function (error, res) {
          if (error) return done(error)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
