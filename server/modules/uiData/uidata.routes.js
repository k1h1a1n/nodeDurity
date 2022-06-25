var uidata = require('./uidata.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  //app.get('/api/hello/', uidata.getHello)
  //app.get('/api/hello/:helloId', uidata.getHelloById)
  app.get('/api/getemailtemplate',auth.isAuthenticated,uidata.getemailtemplate)

  app.get('/api/getPersonalisedWill', uidata.editWill)
  
  app.get('/api/getencryptiondisclaimer',auth.isAuthenticated,uidata.getencryptiondisclaimer)
  // POST
 // app.post('/api/hello', hello.postHello)
  // PUT
  //app.put('/api/hello/:helloId', hello.putHello)
  // DELETE
 // app.delete('/api/hello/:helloId', hello.deleteHello)
  // PARAM
 // app.param('helloId', hello.paramHello)
}
