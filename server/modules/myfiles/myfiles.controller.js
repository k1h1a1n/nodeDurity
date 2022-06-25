exports.getMyfiles = getMyfiles;
exports.deleteMyfiles = deleteMyfiles;
exports.postMyfiles = postMyfiles;
exports.putMyfiles = putMyfiles;
exports.getMyfilesById = getMyfilesById;
exports.deletefile = deletefile;
exports.check = check;
//exports.paramMyfiles = paramMyfiles
exports.deletecontact = deletecontact;
exports.deletecheck = deletecheck;
exports.deleteBeneficiaryDetails = deleteBeneficiaryDetails;
exports.addBeneficery = addBeneficery;

var auto = require("run-auto");
var email = require("../../mail");
var mongoose = require("mongoose");
var myfiless = mongoose.model("myfiles");
var _ = require("lodash");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
let userModule = require("../users/users.controller.js");
let contactsModule = require("../Contacts/Contacts.controller");
var settings = require("../../../configs/settings.js").get();
var flag = false;
//var logger = require('./../../logger.js').logger

ObjectID = require("mongodb").ObjectID;

function getMyfiles(req, res, next) {
  auto(
    {
      myfiless: function(cb) {
        myfiless.find({ user_id: req.query.user_id, status: "true" }).exec(cb);
      }
    },
    function(error, results) {
      if (error) return next(error);
      return res.status(200).send(results.myfiless);
    }
  );
}
function deletecheck(req, res, next) {
  console.log("Delete Check called");

  myfiless.update(
    { user_id: req.query.user_id },
    { $pull: { Beneficiary3: { contactId: req.body.contact._id } } },
    function(err, numAffected) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send();
      }
    }
  );
}
function deletefile(req, res, next) {
  console.log(req.body);

  myfiless.findOneAndUpdate(
    { file_id: req.body.file.file_id },
    { $set: { status: false } },
    { new: true },
    function(err, doc) {
      if (err) {
        return res.status(400).send("Something wrong when deleting data!");
        console.log("Something wrong when updating data!");
      }
      console.log("deleted successfully" + doc);
      return res.status(200).send(doc);
    }
  );
}
function deleteMyfiles(req, res, next) {
  // req.myfiles.remove(function () {
  //   res.status(204).send()
  // })
  myfiless.findOneAndUpdate(
    { file_id: req.body.file.file_id },
    { $set: { status: false } },
    { new: true },
    function(err, doc) {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      console.log("deleted successfully" + doc);
    }
  );
}
function check(req, res) {
  console.log("check called");
  console.log(req.body.status);
  if (req.body.status == true) {
    console.log("true called");
    postMyfiles(req, res);
  } else {
    console.log("false called");
    deletecontact(req, res);
    //deletecheck(req,res)
  }
}
function deletecontact(req, res, next) {
  console.log("delete coinatc");
  if (req.body.type == "Beneficiary1") {
    console.log("Inside BEN1");

    myfiless.update(
      { user_id: req.query.user_id },
      { $pull: { Beneficiary1: { contactId: req.body.contact._id } } },

      function(err, numAffected) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send();
        }
      }
    );
  } else if (req.body.type == "Beneficiary2") {
    console.log("Inside BEN2");

    myfiless.update(
      { user_id: req.query.user_id },
      { $pull: { Beneficiary2: { contactId: req.body.contact._id } } },
      function(err, numAffected) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send();
        }
      }
    );
  } else if (req.body.type == "Beneficiary3") {
    console.log("Inside BEN3");

    myfiless.update(
      { user_id: req.query.user_id },
      { $pull: { Beneficiary3: { contactId: req.body.contact._id } } },
      function(err, numAffected) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send();
        }
      }
    );
  }
}
//file_id contact_id user_id filename
function addBeneficery(
  file_id,
  contact_id,
  user_id,
  filename,
  tier,
  hybridEncKey,
  hybridEncIv
) {
  console.log("B1");
  if (
    file_id == undefined ||
    contact_id == undefined ||
    user_id == undefined ||
    filename == undefined
  ) {
    console.log("NULL VALUE OBTAINED");
    return "Undefined or null value obtained";
  }
  myfiless.findOne({ file_id: file_id }, function(err, docs) {
    console.log("ssss" + docs);
    if (docs == null) {
      let user1;

      if (tier === "1") {
        user1 = new myfiless({
          user_id: user_id,
          filename: filename,
          file_id: file_id,
          status: true,
          //rename to type..

          //BenficeryType :
          Beneficiary1: {
            contactId: contact_id,
            shared_on: new Date(),
            status: true
          },
          hybridEncKey: hybridEncKey,
          hybridEncIv: hybridEncIv
        });
      }
      if (tier === "2") {
        user1 = new myfiless({
          user_id: user_id,
          filename: filename,
          file_id: file_id,
          status: true,
          //rename to type..
          //BenficeryType :
          Beneficiary2: {
            contactId: contact_id,
            shared_on: new Date(),
            status: true
          },
          hybridEncKey: hybridEncKey,
          hybridEncIv: hybridEncIv
        });
      }
      if (tier === "3") {
        user1 = new myfiless({
          user_id: user_id,
          filename: filename,
          file_id: file_id,
          status: true,
          //rename to type..

          //BenficeryType :
          Beneficiary3: {
            contactId: contact_id,
            shared_on: new Date(),
            status: true
          },
          hybridEncKey: hybridEncKey,
          hybridEncIv: hybridEncIv
        });
      }
      //Saving the model instance to the DB
      user1.save(function(err, result) {
        if (err) throw err;
        else {
          console.log("Benficery Saved Successfully");
          sendEmailToBeneficiary(user_id, contact_id);
          return result;
        }
      });
    } else {
      pushBeneficery(file_id, contact_id, tier, user_id);
    }
  });
}
function sendEmailToBeneficiary(user_id, contact_id) {
  contactsModule.getContactEmailById(contact_id).then(res => {
    if (res != null) {
      let emailOfBeneficiary = res;
      userModule
        .getUserInfoByUserId(user_id)
        .then(info => {
          let text = settings.email.templates.informFileUploadToBeneficiary.text(
            info.profile.name,
            info.durity_id
          );
          email.sendEmail(
            text,
            settings.email.templates.informFileUploadToBeneficiary.subject,
            emailOfBeneficiary
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
}
//pushing data to Ben1 if already that fileID exists
function pushBeneficery(file_id, contact_id, BeneficeryNumber, user_id) {
  //  var BenficeryType1=req.body.type;
  //      console.log(BeneficeryType1); req.body.contact._id  req.body.file.file_id
  console.log("getfile called");
  console.log();
  if (contact_id == undefined || file_id == undefined) {
    console.log("NULL VALUE OBTAINED");
    return "Undefined or null value";
  }
  let BeneficiaryContactId = "Beneficiary" + BeneficeryNumber + ".contactId";
  myfiless.findOne(
    { file_id: file_id, BeneficiaryContactId: contact_id },
    function(err, docs) {
      if (err) throw err;

      if (docs != null) {
        return "Already added";
      } else {
        if (BeneficeryNumber == 1) {
          myfiless.update(
            { file_id: file_id },
            {
              $push: {
                //rename to type..
                Beneficiary1: {
                  status: "true",
                  shared_on: new Date(),
                  contactId: contact_id
                }
              }
            },
            { upsert: true },
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                sendEmailToBeneficiary(user_id, contact_id);
                console.log("Successfully Pushed");
                return result;
              }
            }
          );
        } else if (BeneficeryNumber == 2) {
          myfiless.update(
            { file_id: file_id },
            {
              $push: {
                //rename to type..
                Beneficiary2: {
                  status: "true",
                  shared_on: new Date(),
                  contactId: contact_id
                }
              }
            },
            { upsert: true },
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                sendEmailToBeneficiary(user_id, contact_id);
                console.log("Successfully Pushed");
                return result;
              }
            }
          );
        } else if (BeneficeryNumber == 3) {
          myfiless.update(
            { file_id: file_id },
            {
              $push: {
                //rename to type..
                Beneficiary3: {
                  status: "true",
                  shared_on: new Date(),
                  contactId: contact_id
                }
              }
            },
            { upsert: true },
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                sendEmailToBeneficiary(user_id, contact_id);
                console.log("Successfully Pushed");
                return result;
              }
            }
          );
        }
      }
    }
  );
}
function postMyfiles(req, res, next) {
  
  console.log(req.body);
  console.log("postMyfiles called ");
  var beneficiaries = (req.body.beneficiaries)
  beneficiaries.forEach(function(obj){

  // req.assert('name', 'The name cannot be blank').notEmpty()
  //var errors = req.validationErrors()
  // if (errors) {
  //   return res.status(400).send({
  //     success: false,
  //     message: errors[0].message,
  //     redirect: '/'
  //   })
  // }
  // req.body.user = "req.query.user_id"
  // myfiless.create(req.body, function (error, data) {
  //   if (error) return next(error)
  //   return res.status(201).send(data)
  // })
  //var BenficeryType = null;
  //console.log(BenficeryType);

  if (obj.tier == "1") {
    console.log("B1");
    if (
      req.body.file.file_id == undefined ||
      obj.contact_id == undefined ||
      req.query.user_id == undefined ||
      req.body.file.filename == undefined
    ) {
      console.log("NULL VALUE OBTAINED");
      return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
    }
    myfiless.findOne({ file_id: req.body.file.file_id }, function(err, docs) {
      console.log("ssss" + docs);
      if (docs == null) {
        var user1 = new myfiless({
          user_id: req.query.user_id,
          filename: req.body.file.filename,
          file_id: req.body.file.file_id,
          status: true,
          //rename to type..

          //BenficeryType :
          Beneficiary1: {
            contactId: req.body.contact._id,
            shared_on: new Date(),
            status: true
          }
        });

        //Saving the model instance to the DB
        user1.save(function(err) {
          if (err) throw err;
          console.log("Benficery Saved Successfully");
        });
      } else {
        pushBeneficery1(req, res, next, req.query.user_id, obj.contact_id);
      }
    });
  } else if (obj.tier == "2") {
    console.log("B2");
    if (
      req.body.file.file_id == undefined ||
      obj.contact_id == undefined ||
      req.query.user_id == undefined ||
      req.body.file.filename == undefined
    ) {
      console.log("NULL VALUE OBTAINED");
      return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
    }
    myfiless.findOne({ file_id: req.body.file.file_id }, function(err, docs) {
      console.log("ssss" + docs);

      if (docs == null) {
        var user1 = new myfiless({
          user_id: req.query.user_id,
          filename: req.body.file.filename,
          file_id: req.body.file.file_id,
          status: true,
          //rename to type..

          //BenficeryType :
          Beneficiary2: {
            contactId: obj.contact_id,
            shared_on: new Date(),
            status: true
          }
        });

        //Saving the model instance to the DB
        user1.save(function(err) {
          if (err) throw err;
          console.log("Benficery2 Saved Successfully");
        });
      } else {
        pushBeneficery2(req, res, next, req.query.user_id, obj.contact_id);
      }
    });
  } else if (obj.tier == "3") {
    console.log("B3");
    if (
      req.body.file.file_id == undefined ||
      obj.contact_id == undefined ||
      req.query.user_id == undefined ||
      req.body.file.filename == undefined
    ) {
      console.log("NULL VALUE OBTAINED");
      return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
    }
    myfiless.findOne({ file_id: req.body.file.file_id }, function(err, docs) {
      console.log("ssss" + docs);
      if (docs == null) {
        var user1 = new myfiless({
          user_id: req.query.user_id,
          filename: req.body.file.filename,
          file_id: req.body.file.file_id,
          status: true,
          //rename to type..
          //BenficeryType :
          Beneficiary1: {
            contactId: obj.contact_id,
            shared_on: new Date(),
            status: true
          }
        });
        //Saving the model instance to the DB
        user1.save(function(err) {
          if (err) throw err;
          console.log("Benficery3 Saved Successfully");
        });
      } else {
        pushBeneficery3(req, res, next, req.query.user_id, obj.contact_id);
      }
    });
  } else {
    console.log("hhelo")
    return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
  }
});
  console.log("Done");
  console.log(flag);
  if(flag==true)
   {res.status(200).send({ message: "Sucessfully Added" });}
}


//pushing data to Ben1 if already that fileID exists
function pushBeneficery1(req, res, next, user_id, contact_id) {
  //  var BenficeryType1=req.body.type;
  //      console.log(BeneficeryType1);
  console.log("getfile called");
  console.log(req.body);
  if (contact_id == undefined || req.body.file.file_id == undefined) {
    console.log("NULL VALUE OBTAINED");
    return res.status(422).send("UNDEFINED FROM CLIENT REQUEST");
  }
  myfiless.findOne(
    {
      file_id: req.body.file.file_id,
      "Beneficiary1.contactId": contact_id
    },
    function(err, docs) {
      if (err) throw err;
      if (docs != null) {
        flag=false;
        return res.status(422).send({ message: "Already Added" });
      } else {
        myfiless.update(
          { file_id: req.body.file.file_id },
          {
            $push: {
              //rename to type..
              Beneficiary1: {
                status: "true",
                shared_on: new Date(),
                contactId: contact_id
              }
            }
          },
          { upsert: true },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed");
              flag= true;
              sendEmailToBeneficiary(user_id, contact_id);
            }
          }
        );
      }
    }
  );
}
//pushing data to Ben2 if already that fileID exists
function pushBeneficery2(req, res, next, user_id, contact_id) {
  console.log("getfile called");
  console.log(req.body);
  if (contact_id == undefined || req.body.file.file_id == undefined) {
    console.log("NULL VALUE OBTAINED");
    return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
  }
  myfiless.findOne(
    {
      file_id: req.body.file.file_id,
      "Beneficiary2.contactId": contact_id
    },
    function(err, docs) {
      if (err) throw err;
      if (docs != null) {
        console.log("Contact ", docs);
        return res.status(422).send({ message: "Already Added" });
      } else {
        myfiless.update(
          { file_id: req.body.file.file_id },
          {
            $push: {
              //rename to type..
              Beneficiary2: {
                status: "true",
                shared_on: new Date(),
                contactId: contact_id
              }
            }
          },
          { upsert: true },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed");
              sendEmailToBeneficiary(user_id, contact_id);
              //res.status(200).send({ message: "Sucessfully Added" });
            }
          }
        );
      }
    }
  );
}
//pushing data to Ben3 if already that fileID exists
function pushBeneficery3(req, res, next, user_id, contact_id) {
  console.log("getfile called");
  console.log(req.body);
  if (contact_id == undefined || req.body.file.file_id == undefined) {
    console.log("NULL VALUE OBTAINED");
    return res.status(400).send("UNDEFINED FROM CLIENT REQUEST");
  }
  myfiless.findOne(
    {
      file_id: req.body.file.file_id,
      "Beneficiary3.contactId": contact_id
    },
    function(err, docs) {
      if (err) throw err;
      if (docs != null) {
        return res.status(422).send({ message: "Already Added" });
      } else {
        myfiless.update(
          { file_id: req.body.file.file_id },
          {
            $push: {
              //rename to type..
              Beneficiary3: {
                status: "true",
                shared_on: new Date(),
                contactId: contact_id
              }
            }
          },
          { upsert: true },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Pushed");
              sendEmailToBeneficiary(user_id, contact_id);
              //res.status(200).send({ message: "Sucessfully Added" });
            }
          }
        );
      }
    }
  );
}

function putMyfiles(req, res, next) {
  req.myfiles = _.merge(req.myfiles, req.body);
  req.myfiles.save(function(error) {
    if (error) return next(error);
    return res.status(200).send(req.myfiles);
  });
}
function getMyfilesById(req, res, next) {
  //check whether file belongs to the user or not
  //if(myfiless.find({ user_id: req.query.user_id, status: "true" }))
  auto(
    {
      myfiless: function(cb) {
        myfiless.find({ user_id: req.query.user_id, status: "true" }).exec(cb);
      }
    },
    function(error, results) {
      if (error) return next(error);
      return res.status(200).send(results.myfiless);
    }
  );
  //  res.send(req.myfiles)
}
function paramMyfiles(req, res, next, id) {
  req.assert("myfilesId", "Your Myfiles ID cannot be blank").notEmpty();
  req.assert("myfilesId", "Your Myfiles ID has to be a real id").isMongoId();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: "/"
    });
  }
  auto(
    {
      myfiles: function(cb) {
        myfiless.findOne({ _id: id }).exec(cb);
      }
    },
    function(error, results) {
      if (error) return next(error);
      req.myfiles = results.myfiles;
      next();
    }
  );
}
function deleteBeneficiaryDetails(req, res) {
  console.log("Delete contacts ");
  if (req.body.type == "tier 1") {
    console.log("Inside BEN1");

    myfiless.update(
      { user_id: req.query.user_id, file_id: req.body.file.file_id },
      { $pull: { Beneficiary1: { contactId: req.body.contact._id } } },
      function(err, numAffected) {
        if (err) {
          console.log(err);
          res.status(400).send();
        } else {
          res.status(200).send();
        }
      }
    );
  } else if (req.body.type == "tier 2") {
    console.log("Inside BEN2");

    myfiless.update(
      { user_id: req.query.user_id, file_id: req.body.file.file_id },
      { $pull: { Beneficiary2: { contactId: req.body.contact._id } } },
      function(err, numAffected) {
        if (err) {
          console.log(err);
          res.status(400).send();
        } else {
          res.status(200).send();
        }
      }
    );
  } else if (req.body.type == "tier 3") {
    console.log("Inside BEN3");

    myfiless.update(
      { user_id: req.query.user_id, file_id: req.body.file.file_id },
      { $pull: { Beneficiary3: { contactId: req.body.contact._id } } },
      function(err, numAffected) {
        if (err) {
          console.log(err);
          res.status(400).send();
        } else {
          res.status(200).send();
        }
      }
    );
  }
}
