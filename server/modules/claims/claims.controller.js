exports.getAllClaims = getAllClaims
exports.deleteClaims = deleteClaims
exports.postClaims = postClaims
exports.putClaims = putClaims
exports.getClaimsById = getClaimsById
exports.paramClaims = paramClaims
exports.onClaims = onClaims
exports.nominatorList = nominatorList
//exports.generateClaimID = generateClaimID
exports.postFiles = postFiles
exports.saveFileID = saveFileID
//exports.getEmailID= getEmailID
exports.verifyClaim = verifyClaim
exports.getUserClaim = getUserClaim
exports.fileDetails = fileDetails
exports.downloadFile = downloadFile
exports.updateResponseStatus = updateResponseStatus
exports.postUploadFiles = postUploadFiles
exports.deleteProof = deleteProof
exports.getEmailID = getEmailID
exports.submitClaim = submitClaim

exports.getContactConsenses = getContactConsenses
exports.changeProofType = changeProofType
exports.proofTypeList = proofTypeList
exports.rejectClaim = rejectClaim
exports.referBackClaim = referBackClaim
exports.contactconsensusApprover = contactconsensusApprover
exports.approverDetails = approverDetails
exports.approverContactDetails = approverContactDetails
exports.approverAccept = approverAccept
//exports.populateTest = populateTest

exports.approverReject = approverReject
exports.approverHoldBack = approverHoldBack
exports.approverReferBack = approverReferBack
exports.releaseAllDocuments = releaseAllDocuments
exports.verifierList = verifierList
exports.approvedByContactConsensus = approvedByContactConsensus
exports.approvedByMajorty = approvedByMajorty
exports.approvedByNoBlockingResponse = approvedByNoBlockingResponse
exports.approvedByVerfier = approvedByVerfier
//exports.getAllClaimStatus = getAllClaimStatus

exports.sendClaimVerificationMail = sendClaimVerificationMail


var auto = require('run-auto')
var mongoose = require('mongoose')
var claimss = mongoose.model('claims')
var _ = require('lodash')
//var logger = require('./../../logger.js').logger
var myfiles = require('../myfiles/myfiles.model.js')
var myfiless = mongoose.model('myfiles')
var users = require('../users/users.model.js')
var User = mongoose.model('users')
var Contacts = require('../Contacts/Contacts.model.js')
var Contactss = mongoose.model('Contacts')
var Grid1 = require('gridfs-stream');
var stream = require('stream');
var settings = require('../../../configs/settings.js').get()
var mail1 = require('../../mail.js')

var fs = require('fs')
var path = require('path')
var multer = require('multer');
//var archiver = require('archiver');

var {
    ObjectId
} = require('mongodb'); // or ObjectID
// or var ObjectId = require('mongodb').ObjectId if node version < 6
var safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

var nominators = []
var length = 0
Schema = mongoose.Schema;
var gridSchema = new Schema({}, {
  strict: false
});
var Grid2 = mongoose.model("Grid1", gridSchema, "fs.files");
var crypto = require('crypto')

var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport(settings.email.connect)
//var Grid = require('gridfs-stream');
var Archiver = require('archiver')
var archive = Archiver('zip');


//var Grid1 = mongoose.model("Grid", gridSchema, "fs.files" );

function getUserClaim(req, res, next) {
  auto({
    claimss: function (cb) {
      claimss
        .find({
          user_id: req.query.user_id
        })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.claimss)
  })
}

function deleteClaims(req, res, next) {
  req.claims.remove(function () {
    res.status(204).send()
  })
}

function postClaims(req, res, next) {
  // req.assert('name', 'The name cannot be blank').notEmpty()
  console.log('Post claim Called')
  console.log(req.body.claims)
  var errors = req.validationErrors()
  if (errors) {
     
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  req.body.claims.user_id = req.query.user_id
  req.body.user = req.query.user_id
  req.body.claims.contactId = safeObjectId(req.body.claims.contactId)
  claimss.create(req.body.claims, function (error, data) {
    if (error) return next(error)

    console.log('##### ', data.claimId)
    pushtimeline(req, res, 'Draft', data.claimId)
    return res.status(201).send(data)
  })
  saveNomineeComments(req, res)
}

function saveNomineeComments(req, res) {

  console.log('Save nominee Comments ', req.body.claims)
}

function putClaims(req, res, next) {
  console.log('Put claims called ', req.body.claims)
  req.claims = _.merge(req.claims, req.body.claims)
  req.claims.save(function (error) {
    if (error) return next(error)

    console.log(' req ', req.claims)
    pushtimeline(req, res, 'Draft', req.claims.claimId)
    return res.status(200).send(req.claims)
  })
  // req.claims = _.assign(req.body.claims, req.body)
  // req.claims.save(function (error) {
  //   if (error) return next(error)
  //   return res.status(200).send(req.claims)
  // })

  // req.claims = _.assign(req.claims, req.body)
  // req.claims.save(function (error) {
  //   if (error) return next(error)
  //   return res.status(200).send(req.claims)
  // })
}


function getClaimsById(req, res, next) {
  console.log('get claims by id called')
  res.send(req.claims)
}

function paramClaims(req, res, next, id) {
  console.log('get params claims')
  req.assert('claimsId', 'Your Claims ID cannot be blank').notEmpty()
  req.assert('claimsId', 'Your Claims ID has to be a real id').isMongoId()

  // var errors = req.validationErrors()
  // if (errors) {
  //   console.log('error ',errors)
  //   return res.status(400).send({
  //     success: false,
  //     message: errors[0].message,
  //     redirect: '/'
  //   })
  // }
  auto({
    claims: function (cb) {
      claimss
        .findOne({
          claimId: id
        })
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.claims = results.claims
    next()
  })
}

function onClaims(io, socket) {
  return function (msg) {
    io.emit('claims', msg)
  }
}


/*  Starting the nominator list */


function getEmailID(req, res) {

  User.findOne({
    _id: req.query.user_id
  }, function (err, userDetails) {

    console.log('User details ', userDetails.email)
    nominatorList(req, res, userDetails.email)
  })
}

function nominatorList(req, res, emailId) {
  // It gets only  level 1 nominator names

  console.log('get level one called');

  Contactss.find({
    'primaryEmail': emailId
  }, function (err, details) {
    if (err) throw err;
    console.log('Email length ', details.length)
    if (details.length == 0) {
      return res.status(200).send(details)
    }
    length = details.length
    for (var i = 0; i < length; i++) {

      checkdata(req, res, details[i]._id)
      //i++;
    }
    //console.log(' details 'details._id);

  })


}

function checkdata(req, res, data) {
  console.log('User ID is ', req.query.user_id);
  console.log('Contact ID is ', data);

  myfiless.find({
    'Beneficiary1.contactId': data.toString(),
    status: 'true'
  }, function (err, present) {
    console.log('Details length ', present)

    if (present.length == 0) {
      return res.status(422).send({
        'message': "You dont have any nominators as of now"
      })
    }

    for (var i = 0; i < present.length; i++) {
      console.log('Present userID ', present[i].user_id);
      getContactName(req, res, present[i].user_id, data)
      //i++
    }

  })
}

function getContactName(req, res, uid, cid) {

  User.find({
    _id: safeObjectId(uid)
  }, function (err, users) {
    if (err) throw err;

    for (var j = 0; j < users.length; j++) {
      console.log('Nominator names ', users[j].profile.name)

      nominators.push({
        ['nominatorName']: users[j].profile.name, ['cUserId']: uid, ['contactId']: cid
      })

      length--
    }
    while (length == 0) {


      var uniqueArray = removeDuplicates(nominators, "contactId");
      console.log("uniqueArray is: " + JSON.stringify(uniqueArray));
      //console.log('NNN ', non_duplidated_data)
      res.status(200).send(uniqueArray)
      nominators = []
      break;
    }
  })
}
/*  Ending the nominator list */
function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}



function postFiles(req, res, next) {
  //debug('start postFiles')
  console.log("postFiles")
  console.log(req.file)
  getcount(req, res, next)
}

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './upload/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    console.log('reg multer start' + file);
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

function postUploadFiles(req, res, count, next) {
  console.log('Post upload files called');
  // if(count>30){
  //   res.json({error_code:1,count:count, result:null});
  //   console.log({error_code:1,count:count});
  //   return;
  // }
  console.log("************")
  var Parsedres = JSON.parse(req.body.data)
  console.log(' rrrr ', Parsedres.type)
  console.log('reg start');
  console.log(req.file);
  console.log('reg end');

  upload(req, res, function (err) {
    if (err) {
      res.json({
        error_code: 1,
        err_desc: err
      });
      return;
    }
    //    res.json({error_code:0,err_desc:null});
  });

  var password = new Buffer('my secret');
  var aes = crypto.createCipher('aes-256-cbc', password);
  //mongoose.createConnection('mongodb://127.0.0.1/dev11');
  var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/prod');
  //  console.log('sdfsdfs3443dsfdsfdsds');
  Grid1.mongo = mongoose.mongo;
  //  console.log('sdfsdf23443223sdsfdsfdsds');
  conn.once('open', function () {
    //  console.log('open');
    var gfs = Grid1(conn.db);


    var wstream = fs.createWriteStream(makeid() + '_myfile.encrypted');


    var filePath = path.resolve(__dirname, '../../../client/uploads/')
    fs.readFile(req.file.path, function (error, data) {
      var readStream = new stream.PassThrough();
      readStream.end(new Buffer(data));
      readStream // reads from myfile.txt
        .pipe(aes) // encrypts with aes256
        .pipe(wstream) // writes to myfile.encrypted
        .on('finish', function () { // finished
          console.log(' the file  ', req.file)
          var writestream = gfs.createWriteStream({
            filename: req.file.originalname,
            metadata: {
              "claimId": Parsedres.claims.claimId,
              status: "true",
              comments: ""
            },
            content_type: req.file.mimetype,
            mode: 'w',


          });
          console.log('parseedddd  sdgd ', Parsedres)
          fs.createReadStream(req.file.path).pipe(writestream);

          writestream.on('close', function (file) {
            // do something with `file`
            console.log(req.file.originalname + 'Written To DB');
            //console.log(file)
            console.log('Successfully Saved')
            saveFileID(req, res, file._id, file.filename, file.metadata.user_id, Parsedres, Parsedres.type, Parsedres.comment)

          });
        });


    });


    console.log('done encrypting');
  });
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/* Function used to get all the uploaded files list from DB */
function viewlist(req, res, next) {

  mongoose.createConnection('mongodb://localhost/prod');


  Grid2.find({
    metadata: {
      user_id: req.query.user_id,
      status: "true"
    }
  }, function (err, gridfiles) {

    if (err) throw err;
    console.log(gridfiles);


    return res.send(gridfiles)
    //mongoose.connection.close();
  });


}

function getcount(req, res, next) {

  console.log("Get count executed")
  console.log(req.file)
  mongoose.createConnection('mongodb://localhost/prod');

  //Hard coding for ui purpose
  Grid2.find({
    metadata: {
      user_id: req.query.user_id,
      status: "true"
    }
  }).
    //mongoose.connection.close();
    count(function (err, count) {

      if (err) throw err;
      console.log(count);
      // return res.write("The count is"+gridfiles)
      if (count < 3000) {
        postUploadFiles(req, res, count, next)
      } else {
        return res.json({
          error_code: 1,
          count: count,
          result: "LIMIT EXCEEDED"
        });
      }

      //return  res.json({count :count});

    })

}

function saveFileID(req, res, fileId, Filename, fileMetadataUser_id, id, type, comment) {
  //claimss.findOneAndUpdate({claimId:req.body.claims.claimId, user_id: req.query.user_id},

  console.log('reqqq cc', id.claims.claimId)
  claimss.update({
    claimId: id.claims.claimId
  }, {
      $push: {
        //rename to type..
        files: {

          "shared_on": new Date(),
          "file_id": fileId,
          "fileName": Filename,
          "proofType": type,
          "comment": comment

        }
      }
    }, {
      upsert: true
    }, function (err) {
      if (err) {
        console.log(err);
        res.status(422).send({
          'message': "Error "
        })

      } else {
        console.log("Successfully Pushed");
        res.status(200).send({
          'message': "Sucessfully Added"
        })

      }
    });

}


function verifierList(req, res) {


  claimss.find({
    claimStatus: {
      $nin: ['Saved', 'Draft']
    }
  }, function (err, verifierList) {
    if (err) throw err
    //return res.status(400).send({'message':'Something went wrong while fetching try again'})

    return res.status(200).send(verifierList)
  })


}

function verifyClaim(req, res) {

  console.log('Inside verify claimn ', req.body)
  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, present) {
    if (present.claimStatus == "Verified") {
      return res.status(400).send('This claim has been already verified. You can only verify once')
    } else {
      claimss.findOneAndUpdate({
        claimId: req.body.claimId
      },

        {
          $set: {
            claimStatus: "Verified"
          }
        }, {
          new: true
        },
        function (err, doc) {
          if (err) {
            return res.status(400).send('Something wrong when deleting data!')

            console.log("Something wrong when updating data!");
          }

          console.log("Verified successfully" + doc);
          claimss.findOneAndUpdate({
            claimId: req.body.claimId
          }, {
              $push: {
                //rename to type..
                'comments.verifierComments': {
                  "comments": req.body.comments,
                  "commentDate": new Date(),
                  "verifierUserId": req.query.user_id,
                  "status": "Verified"
                }

              }
            }, function (err, doc) {
              if (err) {
                console.log(err);
              } else {
                //console.log("Successfully Pushed ", doc);
                sendClaimVerificationMail(req, res)
                pushtimeline(req, res, 'Verified', req.body.claimId)
                return res.status(200).send(doc)
              }
            });

        })
    }
  })


}

function sendClaimVerificationMail(req, res) {

  console.log('Send claim Verification ', req.body.claimId)

  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, claimDetails) {

    var country = claimDetails.placeofIncident.country
    var state = claimDetails.placeofIncident.state
    var city = claimDetails.placeofIncident.city
    var nomName1 = claimDetails.nominator
    var claimerUserId = claimDetails.user_id
    var status = claimDetails.livingStatus
    console.log('**** CC ', country)

    User.findOne({
      _id: claimerUserId
    }, function (err, claimerName) {
      if (err) throw err;

      var claimerName1 = claimerName.profile.name
      var claimerEmail = claimerName.email
      console.log('!!!!!! ', claimerName1)
      getEmailAddresses(req, res, claimDetails.cUserId, claimDetails.user_id, claimDetails.reason,
        claimDetails.dateofIncident, country, state, city, nomName1, claimerName1, status, claimerEmail)
    })


  })

}

function getEmailAddresses(req, res, cUserId, claimerUserId, reason, dateofIncident, country, state, city, nomName1, claimerName1,
  status, claimerEmail) {
  console.log('^^^^^^ ', country)
  mail = [];
  contactIdArray = []
  var plength

  Contactss.find({
    'user_id': cUserId
  }, function (err, details) {
    if (err) throw err;

    plength = details.length

    for (var p = 0; p < details.length; p++) {
      console.log('Email Address ', details[p].primaryEmail)
      mail.push(details[p].primaryEmail)
      contactIdArray.push(details[p]._id)
      plength--
    }

    if (plength == 0) {
      console.log('Inside plength', mail.length)
      for (var s = 0; s < mail.length; s++) {
        sendMail(req, res, mail[s], contactIdArray[s], claimerUserId, reason, dateofIncident, country, state, city, nomName1,
          claimerName1, status, claimerEmail)
      }
      // res.status(200).send(mail)
    }

  })


}



function sendMail(req, res, mailId, cidMail, claimerUserId, reason, dateofIncident, country, state, city, nomName1, claimerName1,
  status, claimerEmail) {
  console.log('ee ', req.body.claimId)
  console.log("step1");
  console.log('Maild ', mailId);
  console.log('Claimer email ', claimerEmail)

  if (mailId == claimerEmail) {
    return
  }

  date = new Date(dateofIncident)

  Contactss.findOne({
    primaryEmail: mailId
  }, function (err, details12) {
    if (err) throw err;

    console.log('details *** ', details12.firstName)
    var name = details12.firstName

    var demiseTemplate = `<b>Hello ` + name + `, <br> <br> We have just received
            the information from ` + claimerName1 + `, that ` + nomName1 + ` has passed away due to ` + reason + ` on ` + date.toLocaleDateString('en-US') + ` at
            ` + city + `, ` + state + ` ,` + country + `. We are sorry to hear that and our heartfelt condolence to all the near and dear ones! <br> <br>

           Could you please immediately confirm the death of  ` + nomName1 + ` by clicking on this
           <a href = "https://mydurity.com/claims/` + req.body.claimId + `/contact-consensus?contact_id=` + cidMail + `">link.</a>
           Once the claim cause is verified,  ` + claimerName1 + ` and other nominees will have access to the information stored by  ` + nomName1 + ` in Durity.
           <br> <br>
           Thanks for assisting ` + claimerName1 + ` at this hour of need.
            <br> <br>
           For your service, <br>
           Durity LLC</b>`

    var aliveTemplate = `<b>Hello  ` + name + `, <br> <br> We have just received
           the information from ` + claimerName1 + `, that ` + nomName1 + ` has been sick due to ` + reason + ` on ` + date.toLocaleDateString('en-US') + ` at
           ` + city + `, ` + state + ` ,` + country + `. We are sorry to hear that and we wish him a speedy recovery <br> <br>

          Could you please immediately confirm this incident  of  ` + nomName1 + ` by clicking on this
          <a href = "https://mydurity.com/claims/` + req.body.claimId + `/contact-consensus?contact_id=` + cidMail + `">link.</a>
          Once the claim cause is verified,  ` + claimerName1 + ` and other nominees will have access to the information stored by  ` + nomName1 + ` in Durity.
          <br> <br>
          Thanks for assisting ` + claimerName1 + ` at this hour of need.
           <br> <br>
          For your service, <br>
          Durity LLC</b>`

    if (status == "alive") {
      var mailOptions = {
        to: mailId,
        from: settings.email.from,
        subject: 'Request for Claim consensus in durity',
        html: aliveTemplate
      }


      transporter.sendMail(mailOptions, function (error) {
        console.log('transporter mail')
        if (error)
          console.log(error)
        //    cb(error)
      })
    } else {
      var mailOptions = {
        to: mailId,
        from: settings.email.from,
        subject: 'Request for Claim consensus in durity',
        html: template1
      }


      transporter.sendMail(mailOptions, function (error) {
        console.log('transporter mail')
        if (error)
          console.log(error)
        //    cb(error)
      })
    }
    //  })
  })
}


function rejectClaim(req, res) {

  console.log('inside rejectclaim ', req.body)
  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, present) {
    if (present.claimStatus == "Verifier Rejected") {
      return res.status(400).send('This claim has been already verified. You can only verify once')
    } else {
      claimss.findOneAndUpdate({
        claimId: req.body.claimId
      },

        {
          $set: {
            claimStatus: "Verifier Rejected"
          }
        }, {
          new: true
        },
        function (err, doc) {
          if (err) {
            return res.status(400).send('Something wrong when deleting data!')

            console.log("Something wrong when updating data!");
          }
          claimss.findOneAndUpdate({
            claimId: req.body.claimId
          }, {
              $push: {
                //rename to type..
                'comments.verifierComments': {
                  "comments": req.body.comments,
                  "commentDate": new Date(),
                  "verifierUserId": req.query.user_id,
                  "status": "Rejected"
                }

              }
            }, function (err, doc) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully Rejected ", doc);
                pushtimeline(req, res, 'Verifier Rejected', req.body.claimId)

                res.status(200).send(doc)

              }
            });

        })
    }
  })


}

function referBackClaim(req, res) {

  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, present) {
    if (present.claimStatus == "Verifier ReferredBack") {
      return res.status(400).send('This claim has been already Verifier ReferredBack')
    } else {
      claimss.findOneAndUpdate({
        claimId: req.body.claimId
      },

        {
          $set: {
            claimStatus: "Verifier ReferredBack",
            verifierReferBackComments: req.body.comments
          }
        }, {
          new: true
        },
        function (err, doc) {
          if (err) {
            return res.status(400).send('Something wrong when deleting data!')

            console.log("Something wrong when updating data!");
          }

          console.log("Verified successfully" + doc);
          updateCommentsVerifierArrayReferBack(req, res)
          pushtimeline(req, res, 'Verifier ReferredBack', req.body.claimId)

          //return res.status(200).send(doc)
        })
    }
  })
}

function updateCommentsVerifierArrayReferBack(req, res) {
  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  }, {
      $push: {
        //rename to type..
        'comments.verifierComments': {
          "comments": req.body.comments,
          "commentDate": new Date(),
          "verifierUserId": req.query.user_id,
          "status": "Referred Back"
        }

      }
    }, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully Pushed ", doc);
        res.status(200).send(doc)

      }
    });
}

function fileDetails(req, res) {

  claimss.find({
    user_id: req.query.user_id,
    claimStatus: "Approved"
  }, function (err, downloadList) {
    if (err) throw err

    return res.status(200).send(downloadList)
  })

}

function downloadFile(req, res) {
  console.log('Download file called ', req.body)
  var role = req.session;
  var conn = mongoose.connection;
  var gfs = Grid1(conn.db, mongoose.mongo);
  Grid2.findOne({
    _id: req.params.fileId
  }, function (err, file) {
    if (err) {
      return res.status(400).send(err);
    } else if (!file) {
      return res.status(404).send('Error on the database looking for the file.');
    }

    res.mydata = {}

    var readstream = gfs.createReadStream({
      _id: req.params.fileId
    });
    readstream.on("error", function (err) {
      res.end();
    });

    res.set('Content-Type', file._doc.contentType);
    res.set('Content-Disposition', 'inline; filename="' + file._doc.filename + '"');
    readstream.pipe(res)


  });

}

function updateResponseStatus(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId,
    user_id: req.query.user_id
  },

    {
      $set: {
        'statusList.response': req.body.status.response
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      console.log("Updated successfully" + doc);
      return res.status(200).send(doc)
    })
}

function updateResponseStatus(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId,
    user_id: req.query.user_id
  },

    {
      $set: {
        'statusList.response': req.body.status.response
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')
        console.log("Something wrong when updating data!");
      }
      console.log("Updated successfully" + doc);
      return res.status(200).send(doc)
    })
}

function deleteProof(req, res) {
  console.log('Delete proof CID ', req.body.claimId)
  console.log('Delete proof FID ', req.body.file.file_id)

  claimss.update({
    "claimId": req.body.claimId
  }, {
      "$pull": {
        "files": {
          file_id: safeObjectId(req.body.file.file_id)
        }
      }
    },
    function (err, numAffected) {
      if (err) {
        console.log(err);
        res.status(422).send({
          'message': "Delete failed "
        });

      } else {
        res.status(200).send({
          'message': "Sucessfully Deleted "
        });
      }
    }
  );
}

function submitClaim(req, res) {
  console.log('Submit calaim called')

  claimss.findOneAndUpdate({
    claimId: req.body.claimId,
    user_id: req.query.user_id
  }, {
      $push: {
        //rename to type..
        'comments.nomineeComments': {
          "comments": req.body.comments,
          "commentDate": new Date(),
          "nomineeUserId": req.query.user_id,
          "status": req.body.comments
        }

      }
    }, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        //console.log("Successfully Pushed ", doc);
        //res.status(200).send(doc)

      }
    });
  claimss.findOneAndUpdate({
    claimId: req.body.claimId,
    user_id: req.query.user_id
  },

    {
      $set: {
        claimStatus: 'Submitted'
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      //console.log("Updated successfully"+doc);
      pushtimeline(req, res, 'Submitted', req.body.claimId)
      return res.status(200).send(doc)
    })
}

function Submit(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId,
    user_id: req.query.user_id
  },

    {
      $set: {
        'statusList.response': req.body.status.response
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      console.log("Updated successfully" + doc);
      return res.status(200).send(doc)
    })
}

function changeProofType(req, res) {

  console.log('Change proofType called')
  claimss.findOneAndUpdate({
    'files.file_id': safeObjectId(req.body.file.file_id),
    claimId: req.body.claimId,
    user_id: req.query.user_id
  },
    //claimss.findOneAndUpdate({'files.file_id': safeObjectId("5a9807eddbf9151960c12bf1"), claimId: "DCID92106" },

    {
      $set: {
        'files.$.proofType': req.body.file.proofType,
        'files.$.comment': req.body.file.comment
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        console.log('error s ', err)
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      console.log("Updated successfully" + doc);
      return res.status(200).send(doc)
    })
}


function proofTypeList(req, res) {
  console.log('Get prooftypelist called')
  var proofTypes = ['Voter Id', 'Aadhar', 'License', 'Other']
  return res.status(200).send(proofTypes)

}


function getAllClaims(req, res, next) {
  auto({
    claimss: function (cb) {
      claimss
        .find()
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.claimss)
  })
}


function contactconsensusApprover(req, res) {
  console.log('Contact Consensus')

  claimss.update({
    claimId: req.body.claimId
  }, {
      $push: {
        //rename to type..
        contactconsensus: {

          "contact_id": req.body.contact_id,
          "isAccepted": req.body.status,
          "date": new Date(),
          "comment": req.body.comment

        }
      }
    }, {
      upsert: true
    }, function (err) {
      if (err) {
        console.log(err);
        res.status(400).send({
          'message': "Error "
        })

      } else {
        console.log("Successfully Pushed");
        res.status(200).send({
          'message': "Sucessfully Added"
        })

      }
    });

}


function approverContactDetails(req, res) {

  Contactss.find({
    _id: req.body.contact_id
  }, function (err, details2) {
    if (err) throw err;

    return res.status(200).send(details2)
  })
}

function saveContactId(req, res, contactIdArray, claimDetailsArray) {
  console.log('Save contactId array called ssa ', claimDetailsArray)

  var contactIdArrayLength = contactIdArray.length
  console.log('Save contactId array called')
  //console.log(contactIdArray)
  var contactDetails = []
  for (var i = 0; i < contactIdArray.length; i++) {
    Contactss.findOne({
      _id: contactIdArray[i]
    }, function (err, details2) {
      if (err) throw err;
      // console.log('NAMESSSSSSSSSSS  ',details2)
      contactDetails.push(details2)
      contactIdArrayLength--
      //console.log('pp ',contactDetails)
      if (contactIdArrayLength == 0) {
        console.log('contactIdArrayLength is 0')
        var resultArray = contactDetails.concat(claimDetailsArray)
        return res.status(200).send(resultArray)
      }
    })

  }

}

function approverAccept(req, res) {

  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, present) {
    if (err) throw err

    if (present.claimStatus == "Approved") {
      return res.status(422).send({
        'message': 'Already approved'
      })
    } else {
      claimss.update({
        claimId: req.body.claimId
      }, {
          $push: {
            //rename to type..
            'statusList.isClaimApproved': {
              "status": "true",
              "approvedOn": new Date(),
              "comments": req.body.comments,
              "approverUserId": req.query.user_id
            }

          }
        }, {
          upsert: true
        }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully Approved");
            //return res.status(200).send({'message':"Sucessfully Approved"})
            claimss.findOneAndUpdate({
              claimId: req.body.claimId
            }, {
                $push: {
                  //rename to type..
                  'comments.approverComments': {
                    "comments": req.body.comments,
                    "commentDate": new Date(),
                    "approverUserId": req.query.user_id,
                    "status": "Approved"
                  }

                }
              }, function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Successfully Pushed ", doc);
                  //res.status(200).send(doc)

                }
              });
          }
        });

      claimss.findOneAndUpdate({
        claimId: req.body.claimId
      },

        {
          $set: {
            claimStatus: "Approved"
          }
        }, {
          new: true
        },
        function (err, doc) {
          if (err) {
            return res.status(400).send('Something wrong when deleting data!')

            console.log("Something wrong when updating data!");
          }
          releaseAllDocuments(req, res, doc.cUserId)
          //console.log("Updated successfully"+doc);
          pushtimeline(req, res, 'Approved', req.body.claimId)
          return res.status(200).send(doc)
        })

    }
  })


}


function releaseAllDocuments(req, res, user_id) {
  console.log('Release ALL docs ', user_id)
  var dContactIdArray = []
  console.log('Release documents called')

  // Mapping contactID with fileID
  myfiless.find({
    'user_id': user_id
  }, function (err, details1) {
    if (err) throw err;

    var dict = []; // create an empty array


    for (var x = 0; x < details1.length; x++) {
      console.log(details1[x].file_id)

      details1[x].Beneficiary1.forEach(function (message, index) {
        console.log('message index ' + message.contactId);
        dict.push(message.contactId)

      });

    }
    console.log('Diccct ', dict)
    var unique = dict.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    console.log('UUUUUU ', unique)

    for (dictx in unique)
      testFun1(req, res, unique[dictx], user_id)


  })

}



function testFun1(req, res, cids, userId) {
  console.log('Test func ', userId)

  var fidss = []
  var fileNames = []
  var clen = cids.length

  console.log('cid  find ', cids)
  var flen = 0
  myfiless.find({
    'Beneficiary1.contactId': cids.toString()
  }, function (err, docs) {
    if (err) throw err

    console.log('inside find')

    for (y in docs) {
      console.log('*** ', docs[y].file_id)
      fidss.push(docs[y].file_id)
      fileNames.push(docs[y].filename)
      flen++
    }
    console.log('cids ', fidss)
    console.log('User IDDD******//// ', userId)
    testFun(req, res, fidss, cids, userId, fileNames)

  })

}

function testFun(req, res, fileId, contactIds, uid, fileNames) {
  var e
  Contactss.findOne({
    _id: contactIds
  }, function (err, userDetails) {

    console.log('User details ', userDetails.primaryEmail)
    //return userDetails.email
    e = userDetails.primaryEmail


    console.log('Get file by ID called ', fileId)
    console.log('Get contact File Name ', fileNames)
    console.log('Contact ID in fileID ', contactIds)
	var role = req.session;
  var conn = mongoose.connection;
  var gfs = Grid1(conn.db, mongoose.mongo);
  var archive = Archiver('zip');
  console.log('UID ', uid)
  Grid2.find({
    'metadata.user_id': uid,
    'metadata.status': "true"
  }, function (err, file) {
    if (err) {
      return res.status(400).send(err);
    } else if (!file) {
      return res.status(404).send('Error on the database looking for the file.');
    }
    console.log('The file is ', file)


    var zipId = makeid()
    var output = fs.createWriteStream(__dirname + '/' + zipId + '.zip');


    var fileLength = fileId.length

    for (var l = 0; l < fileId.length; l++) {
      console.log('NNNNN ***** ', fileId[l])
      archive.append(gfs.createReadStream({
        _id: safeObjectId(fileId[l])
      }), {
          name: fileNames[l]
        });
      fileLength--
    }


    archive.finalize();


    if (fileLength == 0) {
      console.log('Last step')
      archive.pipe(output);

      sendZipMail(req, res, 'file-txt.zip', archive, zipId, e)
      //fileLength = fileId.length
    }
  });



})

  

}

function sendZipMail(req, res, filename, data, zid, e) {
  console.log('Email step ', e)

  var mailOptions = {
    to: e,
    from: settings.email.from,
    subject: "Your documents are ready to download",
    text: "Documents",
    attachments: [{
      'filename': filename,

      //path: 'F:/Vigilare/DurityNewServer/demotest/server/modules/claims/' + zid + '.zip'
      path: __dirname + zid + '.zip'
    }]

}


  transporter.sendMail(mailOptions, function (error) {
    console.log('transporter mail')
    if (error)
      console.log(error)
    //    cb(error)
  })

}

function approverDetails(req, res) {
  // claimss.
  // findOne({ claimId: 'DCID07174' }).
  // populate('contactId').
  // //populate('_id').
  // exec(function (err, story) {
  //   if (err) return handleError(err);
  //   console.log('The author is %s', story);
  //   // prints "The author is Ian Fleming"
  // });
  claimss.aggregate([{
    "$match": {
      $or: [{
        'claimStatus': "Verified"
      }, {
        'claimStatus': 'Approved'
      }]
    }
  }, {
    $lookup: {

      from: "contacts", // collection name in db
      localField: "contactId",
      foreignField: '_id',
      as: "Contacts"
    },

  }

  ]).exec(function (err, students) {
    // students contain WorksnapsTimeEntries
    console.log('  sss', students)
    return res.status(200).send(students)
  });
}

function getContactConsenses(req, res) {

  Contactss.find({
    user_id: req.body.cUserId
  }, function (err, details2) {
    if (err) throw err;

    return res.status(200).send(details2)
  })


}

function approverReject(req, res) {


  claimss.update({
    claimId: req.body.claimId
  }, {
      $push: {
        //rename to type..
        'statusList.isClaimApproved': {
          "status": "false",
          "approvedOn": new Date(),
          "comments": req.body.comments,
          "approverUserId": req.query.user_id
        }

      }
    }, {
      upsert: true
    }, function (err) {
      if (err) {
        console.log(err);
      } else {


        claimss.findOneAndUpdate({
          claimId: req.body.claimId
        }, {
            $push: {
              //rename to type..
              'comments.approverComments': {
                "comments": req.body.comments,
                "commentDate": new Date(),
                "approverUserId": req.query.user_id,
                "status": "Rejected"
              }

            }
          }, function (err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed ", doc);
              //res.status(200).send(doc)

            }
          });

      }
    })

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        claimStatus: "Approver Rejected"
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      //console.log("Updated successfully"+doc);
      pushtimeline(req, res, 'Approver Rejected', req.body.claimId)

      return res.status(200).send(doc)
    })
}

function approverHoldBack(req, res) {
  claimss.update({
    claimId: req.body.claimId
  }, {
      $push: {
        //rename to type..
        'statusList.isClaimApproved': {
          "status": "holdback",
          "approvedOn": new Date(),
          "comments": req.body.comments,
          "approverUserId": req.query.user_id,
          "holdBackDate": req.body.holdBackDate
        }

      }
    }, {
      upsert: true
    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        claimss.findOneAndUpdate({
          claimId: req.body.claimId
        }, {
            $push: {
              //rename to type..
              'comments.approverComments': {
                "comments": req.body.comments,
                "commentDate": new Date(),
                "approverUserId": req.query.user_id,
                "status": "HeldBack",
                "approverHoldBackDate": req.body.holdBackDate
              }

            }
          }, function (err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed ", doc);
              //res.status(200).send(doc)

            }
          });
      }

    })

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        claimStatus: "Approver HeldBack"
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      //console.log("Updated successfully"+doc);
      pushtimeline(req, res, 'Approver HeldBack"', req.body.claimId)
      return res.status(200).send(doc)
    })
}


function approverReferBack(req, res) {
  claimss.update({
    claimId: req.body.claimId
  }, {
      $push: {
        //rename to type..
        'statusList.isClaimApproved': {
          "status": "referredBack",
          "approvedOn": new Date(),
          "comments": req.body.comments,
          "approverUserId": req.query.user_id,
        }

      }
    }, {
      upsert: true
    }, function (err) {
      if (err) {
        console.log(err);
      } else {

        claimss.findOneAndUpdate({
          claimId: req.body.claimId
        }, {
            $push: {
              //rename to type..
              'comments.approverComments': {
                "comments": req.body.comments,
                "commentDate": new Date(),
                "approverUserId": req.query.user_id,
                "status": "Approver ReferredBack"
              }

            }
          }, function (err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed ", doc);
              //res.status(200).send(doc)


            }
          });
      }

    })

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        claimStatus: "Approver ReferredBack"
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      }

      //console.log("Updated successfully"+doc);
      pushtimeline(req, res, 'Approver ReferredBack', req.body.claimId)
      return res.status(200).send(doc)
    })
}



function approvedByContactConsensus(req, res) {


  console.log('approvedByContactConsensus called ', req.body.status)
  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        'approverConclusion.approvedByContactConsensus': req.body.status,
        'approverConclusion.approverUserId': req.query.user_id
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      } else {
        return res.status(200).send(doc)

      }
    })
}

function approvedByMajorty(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        'approverConclusion.approvedByMajorty': req.body.status,
        'approverConclusion.approverUserId': req.query.user_id
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      } else {
        return res.status(200).send(doc)

      }
    })
}

function approvedByNoBlockingResponse(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        'approverConclusion.approvedByNoBlockingResponse': req.body.status,
        'approverConclusion.approverUserId': req.query.user_id
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      } else {
        return res.status(200).send(doc)

      }
    })
}


function approvedByVerfier(req, res) {

  claimss.findOneAndUpdate({
    claimId: req.body.claimId
  },

    {
      $set: {
        'approverConclusion.approvedByNoBlockingResponse': req.body.status,
        'approverConclusion.approverUserId': req.query.user_id
      }
    }, {
      new: true
    },
    function (err, doc) {
      if (err) {
        return res.status(400).send('Something wrong when deleting data!')

        console.log("Something wrong when updating data!");
      } else {
        return res.status(200).send(doc)

      }
    })
}

function pushtimeline(req, res, status, claimId) {

  console.log('Push timeline called')
  if (status == 'Draft') {
    console.log(' if Draft')

    claimss.findOne({
      claimId: claimId
    }, function (err, result) {
      if (err) throw err

      console.log('Length ', result.timeline.length)
      var timelineLength = result.timeline.length
      if (timelineLength == 0) {

        claimss.findOneAndUpdate({
          claimId: claimId
        }, {
            $push: {
              //rename to type..
              'timeline': {
                "date": new Date(),
                "userId": req.query.user_id,
                "status": status
              }

            }
          }, function (err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed ", doc);
              //res.status(200).send(doc)

            }
          });
      } else {
        console.log('No need to save the draft again');

      }
    })


  } else if (status == 'Submitted') {


    console.log('Else if submitted')


    claimss.findOneAndUpdate({
      claimId: claimId
    }, {
        $push: {
          //rename to type..
          'timeline': {
            "comments": req.body.comments,
            "date": new Date(),
            "userId": req.query.user_id,
            "status": status
          }

        }
      }, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          // console.log("Successfully Pushed ", doc);
          //res.status(200).send(doc)

        }
      })



  } else if (status == 'Verified') {

    console.log('verified push ')
    claimss.findOneAndUpdate({
      claimId: claimId
    }, {
        $push: {
          //rename to type..
          'timeline': {
            "comments": req.body.comments,
            "date": new Date(),
            "userId": req.query.user_id,
            "status": status
          }

        }
      }, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          //console.log("Successfully Pushed ", doc);
          //res.status(200).send(doc)
          claimss.findOne({
            claimId: req.body.claimId
          }, function (err, cl) {
            if (err) throw err

            if (cl.contactConsensusStatus == false) {
              claimss.findOneAndUpdate({
                claimId: req.body.claimId
              },

                {
                  $set: {
                    contactConsensusStatus: true
                  }
                }, {
                  new: true
                },
                function (err, doc) {
                  if (err) {
                    return res.status(400).send('Something wrong when deleting data!')

                    console.log("Something wrong when updating data!");
                  } else {
                    console.log('Else called ')
                    claimss.findOneAndUpdate({
                      claimId: claimId
                    }, {
                        $push: {
                          //rename to type..
                          'timeline': {

                            "date": new Date(),
                            "userId": req.query.user_id,
                            "status": 'Contact consensus mail sent'
                          }

                        }
                      }, function (err, doc) {
                        if (err) {
                          console.log(err);
                        } else {
                          //console.log("Successfully Pushed ", doc);
                          //res.status(200).send(doc)

                        }
                      })
                  }

                })
            }
          })


        }
      })



  } else if (status == 'Approved') {

    claimss.findOneAndUpdate({
      claimId: claimId
    }, {
        $push: {
          'timeline': {
            "comments": req.body.comments,
            "date": new Date(),
            "userId": req.query.user_id,
            "status": status
          }
        }
      }, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Pushed ", doc);
        }
      })



  } else {
    claimss.findOneAndUpdate({
      claimId: claimId
    }, {
        $push: {
          //rename to type..
          'timeline': {
            "comments": req.body.comments,
            "date": new Date(),
            "userId": req.query.user_id,
            "status": status
          }

        }
      }, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Pushed ", doc);
        }
      })
  }

}

/* function getAllClaimStatus(req, res) {

  var obj = []
  claimss.findOne({
    claimId: req.body.claimId
  }, function (err, docs) {
    if (err) throw err

    console.log('Status ', docs.claimStatus)
    var currStatus = docs.claimStatus
    //var currStatus = 'Approver ReferredBack'
    if (currStatus == 'Draft') {
      obj.push({
        'pastStatus ': [null]
      }, {
          'currentStatus': ['Draft']
        }, {
          'futureStatus': ['Submitted', 'Verified', 'Contact consensus', 'Approver']
        })
    } else if (currStatus == 'Submitted') {
      obj.push({
        'pastStatus ': ['Draft']
      }, {
          'currentStatus': ['Submitted']
        }, {
          'futureStatus': ['Verified', 'Contact Consensus', 'Approver']
        })
    } else if (currStatus == 'Verified') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted']
      }, {
          'currentStatus': ['Verified']
        }, {
          'futureStatus': ['Contact consensus', 'Approver']
        })
    } else if (currStatus == 'Approved') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted', 'Verified', 'Contact Consensus']
      }, {
          'currentStatus': ['Approved']
        }, {
          'futureStatus': [null]
        })
    } else if (currStatus == 'Verifier Rejected') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted']
      }, {
          'currentStatus': ['Verifier Rejected']
        }, {
          'futureStatus': [null]
        })
    } else if (currStatus == 'Approver Rejected') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted', 'Verified', 'Contact Consensus']
      }, {
          'currentStatus': ['Approver Rejected']
        }, {
          'futureStatus': [null]
        })
    } else if (currStatus == 'Verifier ReferredBack') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted']
      }, {
          'currentStatus': ['Verifier ReferredBack']
        }, {
          'futureStatus': ['Draft', 'Submitted', 'Verified', 'Contact consensus', 'Approver']
        })
    } else if (currStatus == 'Approver ReferredBack') {
      obj.push({
        'pastStatus ': ['Draft', 'Submitted', 'Verified', 'Contact Consensus']
      }, {
          'currentStatus': ['Approver ReferredBack']
        }, {
          'futureStatus': ['Draft', 'Submitted', 'Verified', 'Contact consensus', 'Approver']
        })
    }

    return res.status(200).send(obj)
  })
} */
