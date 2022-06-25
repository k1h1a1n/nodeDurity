var Test = require('./Test.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  app.get('/api/Test/', Test.getTest)
  app.get('/api/Test/:TestId', Test.getTestById)
  // POST
  app.post('/api/Test', Test.postTest)
  // PUT
  app.put('/api/Test/:TestId', Test.putTest)
  // DELETE
  app.delete('/api/Test/:TestId', Test.deleteTest)
  // PARAM
  app.param('TestId', Test.paramTest)
}
