var Contacts = require('./Contacts.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  app.get('/api/Contacts/', Contacts.getContacts)
  
  app.get('/api/getcontactgroups/', auth.isAuthenticated, Contacts.getcontactGroups)
  app.get('/api/Contacts/:ContactsId', auth.isAuthenticated, Contacts.getContactsById)
  app.get('/api/getrelationshipNames', Contacts.getrelationshipNames)
  //app.get('/api/test', auth.isAuthenticated, Contacts.test)
  // POST
  app.post('/api/Contacts', Contacts.postContacts)
  // PUT
  app.put('/api/Contacts/:ContactsId', auth.isAuthenticated, Contacts.putContacts)
  // DELETE
  app.delete('/api/Contacts/:ContactsId', auth.isAuthenticated, Contacts.deleteContacts)
 
  // PARAM
  app.param('ContactsId',  Contacts.paramContacts)
}
