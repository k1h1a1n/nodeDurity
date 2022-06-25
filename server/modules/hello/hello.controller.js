exports.getHello = getHello
exports.deleteHello = deleteHello
exports.postHello = postHello
exports.putHello = putHello
exports.getHelloById = getHelloById
exports.paramHello = paramHello

var auto = require('run-auto')
var mongoose = require('mongoose')
var hellos = mongoose.model('hello')
var _ = require('lodash')
//var logger = require('./../../logger.js').logger

function getHello (req, res, next) {
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

function deleteHello (req, res, next) {
  req.hello.remove(function () {
    res.status(204).send()
  })
}

function postHello (req, res, next) {
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

function putHello (req, res, next) {
  req.hello = _.merge(req.hello, req.body)
  req.hello.save(function (error) {
    if (error) return next(error)
    return res.status(200).send(req.hello)
  })
}


function getHelloById (req, res, next) {
  res.send(req.hello)
}

function paramHello (req, res, next, id) {
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
        .findOne({_id: id})
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.hello = results.hello
    next()
  })
}
