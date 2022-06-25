exports.getTest = getTest
exports.deleteTest = deleteTest
exports.postTest = postTest
exports.putTest = putTest
exports.getTestById = getTestById
exports.paramTest = paramTest

var auto = require('run-auto')
var mongoose = require('mongoose')
var Tests = mongoose.model('Test')
var _ = require('lodash')
//var logger = require('./../../logger.js').logger

function getTest (req, res, next) {
  auto({
    Tests: function (cb) {
      Tests
        .find()
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.Tests)
  })
}

function deleteTest (req, res, next) {
  req.Test.remove(function () {
    res.status(204).send()
  })
}

function postTest (req, res, next) {
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
  Tests.create(req.body, function (error, data) {
    if (error) return next(error)
    return res.status(201).send(data)
  })
}

function putTest (req, res, next) {
  req.Test = _.merge(req.Test, req.body)
  req.Test.save(function (error) {
    if (error) return next(error)
    return res.status(200).send(req.Test)
  })
}


function getTestById (req, res, next) {
  res.send(req.Test)
}

function paramTest (req, res, next, id) {
  req.assert('TestId', 'Your Test ID cannot be blank').notEmpty()
  req.assert('TestId', 'Your Test ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  auto({
    Test: function (cb) {
      Tests
        .findOne({_id: id})
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.Test = results.Test
    next()
  })
}
