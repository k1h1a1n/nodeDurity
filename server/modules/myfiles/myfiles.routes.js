var myfiles = require('./myfiles.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  app.get('/api/myfiles/', myfiles.getMyfiles)
  app.get('/api/myfiles/:myfilesId', auth.isAuthenticated, myfiles.getMyfilesById)
   
  // app.post('/api/myfiles/getfilename/',myfiles.getfilename)
// POST
  //app.post('/api/myfiles', myfiles.postMyfiles)
  // PUT
  app.put('/api/myfiles/:myfilesId', auth.isAuthenticated, myfiles.putMyfiles)
  // DELETE
  app.delete('/api/myfiles/:myfilesId', auth.isAuthenticated, myfiles.deleteMyfiles)
  // PARAM
  //app.param('myfilesId', myfiles.paramMyfiles)
  app.post('/api/myfiles/deletefile',auth.isAuthenticated, myfiles.deletefile)
  app.post('/api/myfiles/check', auth.isAuthenticated, myfiles.check)
  app.post('/api/myfiles/deletecheck', auth.isAuthenticated, myfiles.deletecheck)
  app.post('/api/myfiles/removetiers', auth.isAuthenticated,  myfiles.deleteBeneficiaryDetails)
  app.post('/api/myfiles/selecttiers', auth.isAuthenticated, myfiles.postMyfiles)
  
}