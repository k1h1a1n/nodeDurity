exports.createKey = createKey
exports.checkKey = checkKey

var mongoose = require('mongoose')
var User = mongoose.model('users')
var settings = require('../configs/settings').get()
var jwt = require('jsonwebtoken')
var debug = require('debug')('meanstackjs:users')

function createKey (user, apikey) {
  console.log('create key', user.apikey)
  return jwt.sign({
    _id: user._id
  }, apikey || user.apikey, settings.jwt.options)
}

function checkKey (token, cb) {
  // console.log(token)
  console.log('Inside check key')
  //console.log('Token ',token)
  
  var decoded = jwt.decode(token.substring(7), {complete: true})
  console.log(decoded);
  if (!decoded)
  {   console.log('Nothing to decode:24')
  
    return cb({message: 'Nothing to decode'})
}if (!decoded.payload) {
  console.log('No payload to decode:28')
  return cb({message: 'No payload to decode'})
}
  if (!decoded.payload._id){
    console.log('No user id to decode')
    return cb({message: 'No user id was found in decode'})
}
console.log('Payload ',decoded.payload._id)
  User.findOne({
    _id: decoded.payload._id
  }, function (error, user) {
    if (error) cb(error)
    if (!user) {
      console.log('Authentication failed. User not found.')
      
      cb({message: 'Authentication failed. User not found.'})
    } else {
      console.log('middleware verify user: ', user.email)
      
      debug('middleware verify user: ', user.email)
      jwt.verify(token.substring(7), user.apikey, function (error, decoded) {
        if (error) {
         // cb(null, user)
          
          console.log('middleware verify user: ', error)
          
          debug('middleware verify error: ', error)
          switch (error.name) {
            case 'TokenExpiredError':
              cb({message: 'It appears your token has expired'}) // Date(error.expiredAt)
              break
            case 'JsonWebTokenError':
              cb({message: 'It appears you have invalid signature Token Recieved:' + token})
              break
          }
        } else {
          console.log("decoded value",decoded)
          cb(null, user)
        }
      })
    }
  })
}
