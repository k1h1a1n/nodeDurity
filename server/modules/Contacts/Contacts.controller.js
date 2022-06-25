exports.getContacts = getContacts
exports.deleteContacts = deleteContacts
exports.postContacts = postContacts
exports.putContacts = putContacts
exports.getContactsById = getContactsById
exports.paramContacts = paramContacts
exports.getrelationshipNames = getrelationshipNames
exports.getcontactGroups = getcontactGroups
exports.getContactEmailById=getContactEmailById

var auto = require('run-auto')
var mongoose = require('mongoose')
var Contactss = mongoose.model('Contacts')
var _ = require('lodash')

var myfiles = require('../myfiles/myfiles.model.js')
var myfiless = mongoose.model('myfiles')

var users = require('../users/users.model.js')
var User = mongoose.model('users')
var { ObjectId } = require('mongodb'); // or ObjectID
var safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
var arr = []
var length = 0
//var logger = require('./../../logger.js').logger

function getContacts(req, res, next) {
  console.log('get contacts ', req.query)
  auto({
    Contactss: function (cb) {
      Contactss
        .find({ user_id: req.query.user_id })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.Contactss)
  })
}

function deleteContacts(req, res, next) {
  req.Contacts.remove(function () {
    res.status(204).send()
  })
}

function postContacts(req, res, next) {
  
  // req.assert('name', 'The name cannot be blank').notEmpty()
  console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");

  /*  if (req.body.contacts == undefined || req.query.user_id == undefined || req.body.contacts.firstName == null || req.body.contacts.primaryEmail == null
      || req.body.contacts.mobilePhone == null || req.body.contacts.relationship == null) {
      console.log("NULL VALUE OBTAINED")
      return res.status(400).send("NULL VALUES OBTAINED FROM CLIENT REQUEST")
  
  
    }*/

  User.findOne({ _id: req.query.user_id }, function (err, det) {
    var email = det.email
console.log(req.body.contacts.primaryEmail)
    if (email == req.body.contacts.primaryEmail) {
      return res.status(422).send({ 'message': 'You cannot enter your mail as a contact' })
    } else {
      Contactss.find({ primaryEmail: req.body.contacts.primaryEmail, user_id: req.query.user_id }, function (err, body) {
        if (err) throw err
        //console.log("req body"+ req.body)
        console.log("email" + req.body.contacts.primaryEmail)
        console.log("id" + req.query.user_id)
        console.log("The body is " + body)
        if (body == "" || req.body.contacts.primaryEmail == null) {
          console.log(" EMAIL ADDRESS NOT FOUND")
          var errors = req.validationErrors()
          if (errors) {
            return res.status(400).send({
              success: false,
              message: errors[0].message,
              redirect: '/'
            })
          }
          //console.log(req.user);
          req.body.contacts.user_id = req.query.user_id
          req.body.user = req.query.user_id


          if (req.body.contacts.length == undefined) {

            Contactss.create(req.body.contacts, function (error, data) {

              if (error) return next(error)

              console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

              console.log(data)



            })

          } else {
            req.body.contacts.forEach(function (element) {

              Contactss.create(element, function (error, data) {

                if (error) return next(error)

                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                console.log(data)



              })

            });
          }
          return res.status(201).send("true")


        }
        else {
          res.status(422).send({ 'message': 'EMAIL ALREADY EXISTS' })
          //res.status(201).status({'message':'EMAIL ALREADY EXISTS'})

          console.log("EMAIL ALREADY EXISTS");
        }
      })
    }
  })


}

function putContacts(req, res, next) {

  if (req.body.contacts == undefined || req.query.user_id == undefined || req.body.contacts.firstName == '' || req.body.contacts.primaryEmail == ''
    || req.body.contacts.mobilePhone == '' || req.body.contacts.relationship == '') {
    console.log("NULL VALUE OBTAINED")
    return res.status(400).send("NULL VALUES OBTAINED FROM CLIENT REQUEST")


  }
  req.Contacts = _.merge(req.Contacts, req.body.contacts)
  req.Contacts.save(function (error) {
    if (error) return next(error)
    return res.status(200).send(req.Contacts)
  })
}

function getContactsById(req, res, next) {
  res.send(req.Contacts)
}

function paramContacts(req, res, next, id) {
  req.assert('ContactsId', 'Your Contacts ID cannot be blank').notEmpty()
  req.assert('ContactsId', 'Your Contacts ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  auto({
    Contacts: function (cb) {
      Contactss
        .findOne({ _id: id })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.Contacts = results.Contacts
    next()
  })
}

function getrelationshipNames(req, res) {
  console.log('Get relationship names called')
  var relationshipNames = ["Family",  "Friends","Other"];
  // var relationshipNames = ["Spouse", "Son", "Son-in-Law", "Daughter-in-Law", "Grand-Son", "Grand-Daughter", "Brother",
  //   "Sister", "Father-in-Law", "Mother-in-Law", "Brother-in-Law", "Sister-in-Law", "Cousin", "Uncle", "Aunt", "Niece", "Nephew",
  //   "Neighbour", "Friends", "Attorney/Lawyer", "Doctor", "Accountant", "Insurance Agent", "Banker", "Other"];
  return res.status(200).send(relationshipNames)
}

function checkdata(req, res, data) {
  console.log('ID is ', data);

  myfiless.find({ 'Beneficiary1.contactId': data.toString }, function (err, present) {
    console.log('Details length ', present.length)

    for (var i = 0; i < present.length; i++) {
      console.log('Present userID ', present[i].user_id);

      getcontactName(req, res, present[i].user_id)

    }
  })
}

function getcontactName(req, res, uid) {
  //var id = mongoose.Types.ObjectId(p);
  console.log('User ID ', safeObjectId(uid))
  User.find({ _id: safeObjectId(uid) }, function (err, users) {
    if (err) throw err;

    names = []
    console.log('Users length', users.length)
    for (var j = 0; j < users.length; j++) {
      console.log('Nominator names ', users[j].profile.name)
      // return res.status(200).send(details)
      arr.push(users[j].profile.name)
      length--
    }
    console.log('arr ', names)
    while (length == 0) {
      res.status(200).send(arr)
      arr = []
      break;
    }

  })

}

function getcontactGroups(req, res) {
  console.log('Get relationship names called')
  var contactGroups = ["Family Group", "Friends Group", "Others"];
  return res.status(200).send(contactGroups)
}

function getContactEmailById(contact_id)
{ 

  return new Promise((resolve, reject) => {
    Contactss.findOne({ _id: contact_id }, function (error, result) {
      if (error) {
        const errorObject = {
                msg: 'An error while finding email',
                error, error
             }
             reject(errorObject);
      } else {
        
        if('primaryEmail' in result)
        {  
         resolve(result.primaryEmail);}
        else
         { reject(errorObject);}

      }
    });
 });

}




