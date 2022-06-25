var claims = require('./claims.controller.js')
var multer = require('multer')
var upload = multer({ dest: 'client/uploads/' })

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  //app.get('/api/claims/', auth.isAuthenticated, claims.getClaims)
  app.get('/api/claims/:claimsId',auth.isAuthenticated, claims.getClaimsById)
  app.get('/api/claims', auth.isAuthenticated, claims.getUserClaim)
  //app.get('/api/claims/getnames', claims.getLevelone)
  app.get('/api/claims-getNominatorName',auth.isAuthenticated,  claims.getEmailID)
  app.get('/api/claims-claimDownloadlist', auth.isAuthenticated,  claims.fileDetails)
  app.get('/api/claims-download/:fileId',auth.isAuthenticated, claims.downloadFile)
  app.get('/api/claims-getProofTypes', auth.isAuthenticated, claims.proofTypeList)
  app.get('/api/claims-getAllClaims', auth.isAuthenticated, claims.getAllClaims)
  app.get('/api/claims-approverList',auth.isAuthenticated, claims.approverDetails)
  app.get('/api/claims-verifierList',auth.isAuthenticated, claims.verifierList)
  //app.get('/api/claims-testPopulate', claims.populateTest)
  app.get('/api/claims-tests',auth.isAuthenticated, claims.releaseAllDocuments)
  //app.post('/api/claims-claimStatus', claims.getAllClaimStatus)


  // POST
  app.post('/api/claims/approverAllContacts',auth.isAuthenticated, claims.getContactConsenses)
  app.post('/api/claims', auth.isAuthenticated, claims.postClaims)
  app.post('/api/claims/uploadProof',auth.isAuthenticated,  upload.single('file'), claims.postFiles)
  app.post('/api/claims/save', auth.isAuthenticated, claims.saveFileID)
  app.post('/api/claims/verifyClaim', auth.isAuthenticated, claims.verifyClaim)
  app.post('/api/claims/updateResponseStatus', auth.isAuthenticated, claims.updateResponseStatus)
  app.post('/api/claims/deleteProof', auth.isAuthenticated, claims.deleteProof)
  app.post('/api/claims/submitClaim', auth.isAuthenticated, claims.submitClaim)
  app.post('/api/claims/changetype',auth.isAuthenticated, claims.changeProofType)
  app.post('/api/verifyClaim',auth.isAuthenticated, claims.verifyClaim)
  app.post('/api/rejectClaim',auth.isAuthenticated, claims.rejectClaim)
  app.post('/api/referBackClaim', claims.referBackClaim)  
  app.post('/api/claims/contactConsensus', claims.contactconsensusApprover)
  app.post('/api/claims-approverList/getContactDetails', claims.approverContactDetails)
  app.post('/api/claims/approverAccept', claims.approverAccept)
  app.post('/api/claims/approverReject', claims.approverReject)
  app.post('/api/claims/approverHoldBack', claims.approverHoldBack)
  app.post('/api/claims/approverReferBack', claims.approverReferBack)
  app.post('/api/approver/conclusion/approvedByContactConsensus', claims.approvedByContactConsensus)
  app.post('/api/approver/conclusion/approvedByMajority', claims.approvedByMajorty)
  app.post('/api/approver/conclusion/approvedByNoBlockingResponse', claims.approvedByNoBlockingResponse)
  app.post('/api/approver/conclusion/approvedByVerfier', claims.approvedByVerfier)
  
  
  app.post('/api/claims/testmail', claims.sendClaimVerificationMail)
  app.post('/api/claims/testdocs', claims.releaseAllDocuments)


  // PUT
  app.put('/api/claims/:claimsId',claims.putClaims)
  // DELETE
  app.delete('/api/claims/:claimsId', auth.isAuthenticated, claims.deleteClaims)
  // PARAM
  app.param('claimsId',  claims.paramClaims)
}
