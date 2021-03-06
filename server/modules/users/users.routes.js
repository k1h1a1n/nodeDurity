var user = require('./users.controller.js')
var multer = require('multer')
var upload = multer({ dest: 'client/uploads/' })

module.exports = function (app, auth, mail, settings, models, logger) {
 // app.post('/api/user/testapi',user.testApi)
  app.post('/api/user/files/upload', upload.single('file'), user.duplicateFileNameCheck)
  app.post('/api/user/postUploadFiles', auth.isAuthenticated, user.postUploadFiles)
  app.post('/api/user/authenticate', user.checkLoginInformation, user.postAuthenticate)
  app.get('/api/user/authenticate', user.getAuthenticate)
  app.get('/api/user/getuserinfo', user.getAuthenticate)

  

  app.get('/api/user/logout', user.logout)
  app.post('/api/user/forgot', user.postForgot)
  app.get('/api/user/reset/:token', user.getReset)
  app.post('/api/user/reset/:token', user.postReset)
  app.post('/api/user/signup', user.postSignup)
  app.put('/api/user/profile', auth.isAuthenticated, user.putUpdateProfile)
  app.put('/api/user/password', auth.isAuthenticated, user.putUpdatePassword)
  app.post('/api/user/sendMailToHelpCenter', auth.isAuthenticated, user.sendMailToHelpCenter)
  // app.delete('/api/user/delete', auth.isAuthenticated, user.deleteDeleteAccount)
  app.post('/api/user/delete',user.deleteUserAccount)
  app.get('/api/user/activate/:activationlink',user.getactivationlink)
  app.post('/api/user/activate/',user.sendactivationlink)
  app.post('/api/user/notifymail',user.notifymail)
  app.post('/api/user/uploadPic', upload.single('file'), user.uploadProfilePic)
  app.post('/api/user/postNotes', auth.isAuthenticated, user.duplicateFileNameCheck1)
  app.post('/api/user/getcount',auth.isAuthenticated, user.getcount)
  app.post('/api/user/signupProcessStatus',auth.isAuthenticated, user.updateSignupProcessStatus )
  app.post('/api/user/userEncryptionStatus',auth.isAuthenticated, user.setUserEncryptionStatus)
  app.post('/api/user/setUserEncryptionPasswordHash',auth.isAuthenticated, user.setUserEncryptionPasswordHash)

  //app.get('/api/user/getfilebyid/:fileId',auth.isAuthenticated,user.getFileById) , auth.isAuthenticated,
  
  app.get('/api/user/getfilebyid/:fileId',auth.isAuthenticated,user.getFileById)
  app.get('/api/user/getkeysbyid/:fileId',auth.isAuthenticated,user.getKeysById)

  app.post('/api/user/verifyOTPandGetKeysById',auth.isAuthenticated,user.verifyOTPandGetKeysById)
  app.get('/api/user/getKeysById/:fileId',auth.isAuthenticated,user.getKeysById)
  //OTP API
  app.post('/api/user/sendOTP', auth.isAuthenticated, user.sendOTP)
  app.post('/api/user/resendOTP', auth.isAuthenticated, user.resendOTP)
  // app.post('/api/user/verifyOtp', user.verifyOTP)
  // ADD/GET ROLE
  // app.get('/api/user/role', user.postKey) 
  // app.post('/api/user/role/:role', user.postKey)
  // API KEY
  app.get('/api/user/token', auth.isAuthenticated, user.getKey)
  app.post('/api/user/token', user.checkLoginInformation, user.postKey)
  app.get('/api/user/token/reset', auth.isAuthenticated, user.getKeyReset)
  app.get('/api/user/getfiles',auth.isAuthenticated, user.viewlist)

  // var passport = require('passport')
  // Azure
  // app.get('/api/azure/user', auth.isAuthenticated, user.getUserAzure)
  // app.get('/api/auth/link/azure', auth.isAuthenticated, passport.authenticate('azuread-openidconnect', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/azure/callback', auth.isAuthenticated, passport.authenticate('azuread-openidconnect', { failureRedirect: '/account', session: false }), user.postCallbackAzure)
  // app.get('/api/auth/unlink/azure', auth.isAuthenticated, user.getUnlinkAzure)
  // Instagram
  // app.get('/api/auth/link/instagram', auth.isAuthenticated, passport.authenticate('instagram', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/instagram/callback', auth.isAuthenticated, passport.authenticate('instagram', {failureRedirect: '/account'}), user.postCallbackInstagram)
  // app.get('/api/auth/unlink/instagram', auth.isAuthenticated, user.getUnlinkInstagram)
  // Facebook
  // app.get('/api/auth/link/facebook', auth.isAuthenticated, passport.authenticate('facebook', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/facebook/callback', auth.isAuthenticated, passport.authenticate('facebook', {failureRedirect: '/account'}), user.postCallbackFacebook)
  // app.get('/api/auth/unlink/facebook', auth.isAuthenticated, user.getUnlinkFacebook)
  // Twitter
  // app.get('/api/auth/link/twitter', auth.isAuthenticated, passport.authenticate('twitter', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/twitter/callback', auth.isAuthenticated, passport.authenticate('twitter', {failureRedirect: '/account'}), user.postCallbackTwitter)
  // app.get('/api/auth/unlink/twitter', auth.isAuthenticated, user.getUnlinkTwitter)
  // GitHub
  // app.get('/api/auth/link/gitHub', auth.isAuthenticated, passport.authenticate('gitHub', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/gitHub/callback', auth.isAuthenticated, passport.authenticate('gitHub', {failureRedirect: '/account'}), user.postCallbackGitHub)
  // app.get('/api/auth/unlink/gitHub', auth.isAuthenticated, user.getUnlinkGitHub)
  // Google
  // app.get('/api/auth/link/google', auth.isAuthenticated, passport.authenticate('google', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/google/callback', auth.isAuthenticated, passport.authenticate('google', {failureRedirect: '/account'}), user.postCallbackGoogle)
  // app.get('/api/auth/unlink/google', auth.isAuthenticated, user.getUnlinkGoogle)
  // LinkedIn
  // app.get('/api/auth/link/linkedIn', auth.isAuthenticated, passport.authenticate('linkedIn', {failureRedirect: '/account'}))
  // app.post('/api/auth/link/linkedIn/callback', auth.isAuthenticated, passport.authenticate('linkedIn', {failureRedirect: '/account'}), user.postCallbackLinkedIn)
  // app.get('/api/auth/unlink/linkedIn', auth.isAuthenticated, user.getUnlinkLinkedIn)
}