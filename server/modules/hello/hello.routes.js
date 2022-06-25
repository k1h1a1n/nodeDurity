var hello = require('./hello.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  app.get('/api/hello/', hello.getHello)
  app.get('/api/hello/:helloId', hello.getHelloById)
  // POST
  app.post('/api/hello', hello.postHello)
  // PUT
  app.put('/api/hello/:helloId', hello.putHello)
  // DELETE
  app.delete('/api/hello/:helloId', hello.deleteHello)
  // PARAM
  app.param('helloId', hello.paramHello)
}
