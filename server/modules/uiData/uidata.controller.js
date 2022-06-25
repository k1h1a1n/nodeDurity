exports.getHello = getHello
exports.deleteHello = deleteHello
exports.postHello = postHello
exports.putHello = putHello
exports.getHelloById = getHelloById
exports.paramHello = paramHello
exports.getemailtemplate = getemailtemplate
exports.getencryptiondisclaimer = getencryptiondisclaimer
exports.editWill = editWill

var auto = require('run-auto')
var mongoose = require('mongoose')
var hellos = mongoose.model('hello')
var _ = require('lodash')
var fileUpload = require("../users/users.controller.js");

//var logger = require('./../../logger.js').logger

function getemailtemplate(req, res) {

  var contactGroups = ["Email template goes here....(from uidata)"];
  return res.status(200).send(contactGroups)
}

function getencryptiondisclaimer(req, res) {

  var contactGroups = ["disclaimer template goes here....(from uidata)"];
  return res.status(200).send(contactGroups)
}


function getHello(req, res, next) {
  auto({
    hellos: function (cb) {
      hellos
        .find()
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.hellos)
  })
}

function deleteHello(req, res, next) {
  req.hello.remove(function () {
    res.status(204).send()
  })
}

function postHello(req, res, next) {
  // req.assert('name', 'The name cannot be blank').notEmpty()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  req.body.user = req.user._id
  hellos.create(req.body, function (error, data) {
    if (error) return next(error)
    return res.status(201).send(data)
  })
}

function putHello(req, res, next) {
  req.hello = _.merge(req.hello, req.body)
  req.hello.save(function (error) {
    if (error) return next(error)
    return res.status(200).send(req.hello)
  })
}


function getHelloById(req, res, next) {
  res.send(req.hello)
}

function paramHello(req, res, next, id) {
  req.assert('helloId', 'Your Hello ID cannot be blank').notEmpty()
  req.assert('helloId', 'Your Hello ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  auto({
    hello: function (cb) {
      hellos
        .findOne({ _id: id })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.hello = results.hello
    next()
  })
}

function editWill(req, res) {
 
  const hummus = require('hummus');
  const fs = require('fs');
  const mail = require('../../mail');
  let pdfWriter = hummus.createWriterToModify('server/will_doc/durity_will.pdf', { modifiedFilePath: 'server/will_doc/will-' + req.query.email + '.pdf' });
  let pageModifier = new hummus.PDFPageModifier(pdfWriter, 16);
  
  pageModifier.startContext().getContext().writeText(req.query.name + ",", 82, 611,
    { font: pdfWriter.getFontForFile('server/will_doc/Georgia.ttf'), size: 12, colorspace: 'gray', color: 0x00 }
  )
  pageModifier.endContext().writePage();
  pdfWriter.end();
  attachment = [{ path: 'server/will_doc/will-' + req.query.email + '.pdf' }];
  let options = {
    fileName: 'will-' + req.query.email + '.pdf',
    beneficiaries: null, 
    userDateAndTime: Date(),
    params:
    {
      originalname: 'will-' + req.query.email + '.pdf',
      beneficiaries: null,
      fileInfo: {
        isEncrypted: false,
        userDateAndTime: Date(),
        encryptionType: '',
        hybridEncKey: '',
        hybridEncIv: '',
        originalFileExtension: '',
        fileSizeInBytes: '',
        // Add file size in bytes here
      }
    }
  };

  let fileUrl = "server/will_doc/will-"+req.query.email+".pdf";
  var uploadWillFile = {
    fileUrl : fileUrl,
    options : options,
    email : req.query.email
  }
  
  fileUpload.postUploadWillFile(uploadWillFile);
 // mail.sendEmailWithAttachment("Your peronal will", "Your will, From Durity", req.query.email, attachment);
  
}
exports.getHello = getHello
exports.deleteHello = deleteHello
exports.postHello = postHello
exports.putHello = putHello
exports.getHelloById = getHelloById
exports.paramHello = paramHello
exports.getemailtemplate = getemailtemplate
exports.getencryptiondisclaimer = getencryptiondisclaimer
exports.editWill = editWill

var auto = require('run-auto')
var mongoose = require('mongoose')
var hellos = mongoose.model('hello')
var _ = require('lodash')
var fileUpload = require("../users/users.controller.js");

//var logger = require('./../../logger.js').logger

function getemailtemplate(req, res) {

  var contactGroups = ["Email template goes here....(from uidata)"];
  return res.status(200).send(contactGroups)
}

function getencryptiondisclaimer(req, res) {

  var contactGroups = ["disclaimer template goes here....(from uidata)"];
  return res.status(200).send(contactGroups)
}


function getHello(req, res, next) {
  auto({
    hellos: function (cb) {
      hellos
        .find()
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.hellos)
  })
}

function deleteHello(req, res, next) {
  req.hello.remove(function () {
    res.status(204).send()
  })
}

function postHello(req, res, next) {
  // req.assert('name', 'The name cannot be blank').notEmpty()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  req.body.user = req.user._id
  hellos.create(req.body, function (error, data) {
    if (error) return next(error)
    return res.status(201).send(data)
  })
}

function putHello(req, res, next) {
  req.hello = _.merge(req.hello, req.body)
  req.hello.save(function (error) {
    if (error) return next(error)
    return res.status(200).send(req.hello)
  })
}


function getHelloById(req, res, next) {
  res.send(req.hello)
}

function paramHello(req, res, next, id) {
  req.assert('helloId', 'Your Hello ID cannot be blank').notEmpty()
  req.assert('helloId', 'Your Hello ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  auto({
    hello: function (cb) {
      hellos
        .findOne({ _id: id })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.hello = results.hello
    next()
  })
}

function editWill(req, res) {
 
  const hummus = require('hummus');
  const fs = require('fs');
  const mail = require('../../mail');
  let pdfWriter = hummus.createWriterToModify('server/will_doc/durity_will.pdf', { modifiedFilePath: 'server/will_doc/will-' + req.query.email + '.pdf' });
  let pageModifier = new hummus.PDFPageModifier(pdfWriter, 16);
  
  pageModifier.startContext().getContext().writeText(req.query.name + ",", 82, 611,
    { font: pdfWriter.getFontForFile('server/will_doc/Georgia.ttf'), size: 12, colorspace: 'gray', color: 0x00 }
  )
  pageModifier.endContext().writePage();
  pdfWriter.end();
  attachment = [{ path: 'server/will_doc/will-' + req.query.email + '.pdf' }];
  let options = {
    fileName: 'will-' + req.query.email + '.pdf',
    beneficiaries: null, 
    userDateAndTime: Date(),
    params:
    {
      originalname: 'will-' + req.query.email + '.pdf',
      beneficiaries: null,
      fileInfo: {
        isEncrypted: false,
        userDateAndTime: Date(),
        encryptionType: '',
        hybridEncKey: '',
        hybridEncIv: '',
        originalFileExtension: '',
        fileSizeInBytes: '',
        // Add file size in bytes here
      }
    }
  };

  let fileUrl = "server/will_doc/will-"+req.query.email+".pdf";
  var uploadWillFile = {
    fileUrl : fileUrl,
    options : options,
    email : req.query.email
  }
  
  fileUpload.postUploadWillFile(uploadWillFile);
 // mail.sendEmailWithAttachment("Your peronal will", "Your will, From Durity", req.query.email, attachment);
  
}
