exports.postAuthenticate = postAuthenticate;
exports.getAuthenticate = getAuthenticate;
exports.logout = logout;
exports.postSignup = postSignup;
exports.putUpdateProfile = putUpdateProfile;
exports.deleteUserAccount = deleteUserAccount;
exports.putUpdatePassword = putUpdatePassword;
exports.deleteDeleteAccount = deleteDeleteAccount;
exports.sendMailToHelpCenter= sendMailToHelpCenter;
exports.getReset = getReset;
exports.postReset = postReset;
exports.postForgot = postForgot;
exports.getKey = getKey;
exports.postKey = postKey;
exports.getKeyReset = getKeyReset;
exports.checkLoginInformation = checkLoginInformation;
exports.createResponseObject = createResponseObject;
exports.postFiles = postFiles;
exports.postUploadFiles = postUploadFiles;
exports.postUploadWillFile = postUploadWillFile;
exports.viewlist = viewlist;
exports.getactivationlink = getactivationlink;
exports.sendactivationlink = sendactivationlink;
exports.notifymail = notifymail;
exports.getcount = getcount;
exports.getFileById = getFileById;
exports.getKeysById = getKeysById;
exports.verifyOTPandGetKeysById = verifyOTPandGetKeysById;
exports.getKeysById = getKeysById;
//var quill1 = mongoose.model('quilltext')
exports.duplicateFileNameCheck = duplicateFileNameCheck;
exports.uploadProfilePic = uploadProfilePic;
exports.postNotes = postNotes;
exports.duplicateFileNameCheck1 = duplicateFileNameCheck1;
exports.sendOTP = sendOTP;
exports.verifyOTP = verifyOTP;
exports.resendOTP = resendOTP;
//exports.testApi = testApi
exports.getUserInfoByUserId = getUserInfoByUserId;
exports.updateSignupProcessStatus = updateSignupProcessStatus;
exports.setUserEncryptionStatus = setUserEncryptionStatus;
exports.setUserEncryptionPasswordHash = setUserEncryptionPasswordHash;

var fs = require("fs");
var shortid = require("shortid");
var myFilesModule = require("./../myfiles/myfiles.controller.js");
var mime = require("mime");
var stream = require("stream");
var { ObjectId } = require("mongodb"); // or ObjectID // or var ObjectId = require('mongodb').ObjectId if node version < 6
var MongoClient = require("mongodb").MongoClient;
var Grid = require("gridfs-stream");
var _ = require("lodash");
var auto = require("run-auto");
var crypto = require("crypto");
var passport = require("passport");
var mongoose = require("mongoose");
var User = mongoose.model("users");
//var User1 = mongoose.model('users').quilltext1
var fs = require("fs");
var path = require("path");
var settings = require("../../../configs/settings.js").get();
var mail = require("../../mail.js");
var debug = require("debug")("meanstackjs:users");
var uuid = require("node-uuid");
var tokenApi = require("./../../token.js");
var multer = require("multer");
var { ObjectId } = require("mongodb"); // or ObjectID
// or var ObjectId = require('mongodb').ObjectId if node version < 6
var safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
Schema = mongoose.Schema;
var gridSchema = new Schema({}, { strict: false });
var Grid1 = mongoose.model("Grid", gridSchema, "fs.files");

var myfiles = require("../myfiles/myfiles.model.js");
var myfiless = mongoose.model("myfiles");

var Contacts = require("../Contacts/Contacts.model.js");
var Contactss = mongoose.model("Contacts");
let contactsModule = require("../Contacts/Contacts.controller");
const axios = require("axios");

//var Grid3 = require('mongodb').Grid
var Grid3 = require("gridfs-stream");
Grid3.mongo = mongoose.mongo;

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport(settings.email.connect);

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

//SendOTP! You can create new account in MSG91
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("210007AFUzmxeytK5ad1d481");

var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = "d6F3Efeq";
var zlib = require("zlib");

function generateDurityId() {
  // Database lock is not addded
  let unique_id;
  let isDuplicateId = false;

  do {
    unique_id = shortid.generate();
    User.findOne({ durity_id: unique_id }, function (error, existing) {
      // Avoiding dublicateId
      if (error || existing) {
        isDuplicateId = true;
      } else {
        isDuplicateId = false;
      }
    });
  } while (isDuplicateId);

  return unique_id;
}
function getUserInfo(req, res) {
  let token = req.headers.authorization;
  let redirect = false;
  return res
    .status(200)
    .send(exports.createResponseObject(req.user, token, redirect));
}
function postAuthenticate(req, res, next) {
  debug("start postAuthenticate");
  var redirect = req.body.redirect || false;
  var token = tokenApi.createKey(req.user);
  res.cookie("token", token);
  debug("end postAuthenticate - Logged In");
  return res
    .status(200)
    .send(exports.createResponseObject(req.user, token, redirect));
}

function getAuthenticate(req, res) {
  console.log("start getAuthenticate");
  console.log(req.headers.authorization);
  console.log(req.user);

  debug("start getAuthenticate");
  var redirect = req.body.redirect || false;
  //var token = req.headers.authorization || req.query.token || req.body.token || ''// || req.headers['x-access-token']
  var token = req.headers.authorization;

  if (req.isAuthenticated()) {
    console.log("isAuthenticaed Create key");
    return res
      .status(200)
      .send(
        exports.createResponseObject(
          req.user,
          tokenApi.createKey(req.user),
          redirect
        )
      );
  } else if (token) {
    console.log("check token");

    tokenApi.checkKey(token, function (error, user) {
      if (error)
        return res
          .status(200)
          .send(exports.createResponseObject(req.user, "", redirect));
      req.user = user;
      return res
        .status(200)
        .send(exports.createResponseObject(req.user, token, redirect));
    });
  } else {
    console.log("final else");
    return res
      .status(200)
      .send(exports.createResponseObject(req.user, "", redirect));
  }
  debug("end getAuthenticate");
}

function logout(req, res) {
  debug("start logout");
  req.logout();
  debug("end logout");
  return res.status(200).send();
}

function deleteUserAccount(req, res) {
  console.log("**************************************************");
  User.find({ email: req.body.userDetail.email }, function (err, user) {
    if (err) {
      console.log("user not found");
      console.log(err);
      return res
        .status(404)
        .send("Error on the database looking for the account.");
    } else {
      User.remove({ email: req.body.userDetail.email }, function (err) {
        if (err) {
          console.log("issue in removing account");
          console.log(err);
          return res.status(404).send("Error in the removing the account.");
        }
        console.log("removed account");
        return res.status(200).send();
      });
    }
  });
}

function postSignup(req, res, next) {
  console.log(req.body);
  if (req.body.googlesignin == true) {
    console.log("google sign in called");
    req.assert("profile", "Name must not be empty").notEmpty();
    req.assert("email", "Email is not valid").isEmail();
    req
      .assert("password", "Password must be at least 6 characters long")
      .len(6);
    req
      .assert("confirmPassword", "Passwords do not match")
      .equals(req.body.password);
    var errors = req.validationErrors();
    var redirect = req.body.redirect || false;
    if (errors) {
      console.log("1111111111");
      debug("end postSignup");
      return res.status(400).send({
        success: false,
        authenticated: false,
        message: errors[0].message,
        redirect: "/signup",
      });
    }
    User.findOne({ email: req.body.email }, function (error, existingUser) {
      if (error) {
        return res.status(400).send(error);
      }
      if (existingUser) {
        req.logIn(existingUser, function (error) {
          if (error) {
            return next(error);
          } else {
            var token = tokenApi.createKey(existingUser);
            res.cookie("token", token);
            debug("end postSignup");
            sendactivationlink(req, res, next);
            return res
              .status(200)
              .send(
                exports.createResponseObject(existingUser, token, redirect)
              );
          }
        });
      } else {
        var user = new User({
          durity_id: generateDurityId(),
          email: req.body.email,
          password: req.body.password,
          profile: {
            name: req.body.profile.name,
          },
        });
        user.save(function (error) {
          if (error && error.code === 11000) {
            debug("end postSignup");
            return res.status(400).send({
              message: "Account with that email address already exists.",
            });
          } else if (error && error.name === "ValidationError") {
            var keys = _.keys(error.errors);
            debug("end postSignup");
            return res
              .status(400)
              .send({ message: error.errors[keys[0]].message }); // error.message
          } else if (error) {
            next(error);
          } else {
            req.logIn(user, function (error) {
              if (error) {
                return next(error);
              } else {
                var token = tokenApi.createKey(user);
                res.cookie("token", token);
                debug("end postSignup");
                sendactivationlink(req, res, next);
                return res
                  .status(200)
                  .send(exports.createResponseObject(user, token, redirect));
              }
            });
          }
        });
      }
    });
  } else {
    debug("start postSignup");
    req.assert("profile", "Name must not be empty").notEmpty();
    req.assert("email", "Email is not valid").isEmail();
    req
      .assert("password", "Password must be at least 6 characters long")
      .len(6);
    req
      .assert("confirmPassword", "Passwords do not match")
      .equals(req.body.password);
    var errors = req.validationErrors();
    var redirect = req.body.redirect || false;
    if (errors) {
      debug("end postSignup");
      return res.status(400).send({
        success: false,
        authenticated: false,
        message: errors[0].message,
        redirect: "/signup",
      });
    }
    var user = new User({
      durity_id: generateDurityId(),
      email: req.body.email,
      password: req.body.password,
      profile: {
        name: req.body.profile.name,
        telephoneNumber: req.body.profile.telephoneNumber,
      },
    });
    User.findOne({ email: req.body.email }, function (error, existingUser) {
      if (error) {
        return res.status(400).send(error);
      }
      if (existingUser) {
        debug("end postSignup");
        return res
          .status(400)
          .send({ message: "Account with that email address already exists." });
      }
      user.save(function (error) {
        if (error && error.code === 11000) {
          debug("end postSignup");
          return res.status(400).send({
            message: "Account with that email address already exists.",
          });
        } else if (error && error.name === "ValidationError") {
          var keys = _.keys(error.errors);
          debug("end postSignup");
          return res
            .status(400)
            .send({ message: error.errors[keys[0]].message }); // error.message
        } else if (error) {
          next(error);
        } else {
          req.logIn(user, function (error) {
            if (error) {
              return next(error);
            } else {
              delete user["password"];
              var token = tokenApi.createKey(user);
              res.cookie("token", token);
              debug("end postSignup");
              sendactivationlink(req, res, next);
              return res
                .status(200)
                .send(exports.createResponseObject(user, token, redirect));
            }
          });
        }
      });
    });
  }
}

function sendactivationlink(req, res, next) {
  console.log("step1");
  auto(
    {
      activationlink: function (done) {
        crypto.randomBytes(20, function (error, buf) {
          var activationlink = buf.toString("hex");
          done(error, activationlink);
        });
      },
      user: [
        "activationlink",
        function (results, callback) {
          console.log("step2");

          User.findOne({ email: req.body.email }, function (error, user) {
            if (error) {
              debug("end actiavtelink");
              return res.status(400).send(error);
            }
            // if (!user) {
            //   debug('end activatelink')
            //   return res.status(200).send('/forgot')
            // }
            user.activationlinktoken = results.activationlink;
            user.activationlinkexpires = Date.now() + 1.512e8; // 1 hour
            user.save(function (error) {
              callback(error, user);
            });
          });
        },
      ],
      sendEmail: [
        "user",
        function (results, callback) {
          console.log(results);
          mail.send(
            {
              to: results.user.email,
              subject: settings.email.templates.welcome.subject,
              text: settings.email.templates.welcome.text(
                results.user.profile.name,
                req.headers.host,
                results.activationlink
              ),
            },
            function (error) {
              callback(error, true);
            }
          );
        },
      ],
    },
    function (error) {
      if (error) {
        return next(error);
      }
      debug("end postForgot");
      //return res.status(200).send(exports.createResponseObject(user, token, redirect, {message: 'Email has been sent'}))
    }
  );
}

function putUpdateProfile(req, res, next) {
  debug("start putUpdateProfile" + req.query.user_id);
  User.findById(req.query.user_id, function (error, user) {
    if (error) {
      return next(error);
    }

    user = _.merge(user, req.body);
    // user.email = req.body.email || ''
    // user.profile.name = req.body.name || ''
    // user.profile.gender = req.body.gender || ''
    // user.profile.location = req.body.location || ''
    // user.profile.website = req.body.website || ''
    user.save(function (error) {
      if (error) {
        return res.status(400);
      }
      req.user = user;
      debug("end putUpdateProfile");
      return res.status(200).send(user.profile);
    });
  });
}

function uploadProfilePic(req, res) {
  console.log("Upload profile pic ");
  console.log("ID ", req.query.user_id);
  console.log("Path ", req.file);

  var stream = fs.readFileSync(req.file.path);

  User.findOneAndUpdate(
    { _id: req.query.user_id },

    {
      $set: {
        "profile.picture.data": stream.toString("base64"),
        "profile.picture.contentType": req.file.mimetype,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("error s ", err);
        return res.status(400).send("Something wrong when deleting data!");

        console.log("Something wrong when updating data!");
      }

      //console.log("Updated successfully"+doc);
      return res.status(200).send(doc.profile);
    }
  );
}

function putUpdatePassword(req, res, next) {
  debug("start putUpdatePassword");
  req.assert("password", "Password must be at least 4 characters long").len(4);
  req
    .assert("confirmPassword", "Passwords do not match")
    .equals(req.body.password);
  var errors = req.validationErrors();
  if (errors) {
    return res.status(200).send(errors);
  }
  User.findById(req.query.user_id, function (error, user) {
    if (error) {
      return next(error);
    }
    user.password = req.body.password;
    user.save(function (error) {
      if (error) {
        return next(error);
      }
      debug("end putUpdatePassword");
      res.status(200).send();
    });
  });
}
function deleteDeleteAccount(req, res, next) {
  debug("start deleteDeleteAccount");
  User.remove({ _id: req.query.user_id }, function (error) {
    if (error) {
      return next(error);
    }
    req.logout();
    debug("end deleteDeleteAccount");
    return res.status(200).send();
  });
}

function deleteDeleteAccount(req, res, next) {
  debug("start deleteDeleteAccount");

  User.remove({ _id: req.query.user_id }, function (error) {
    if (error) {
      return next(error);
    }
    req.logout();
    debug("end deleteDeleteAccount");
    return res.status(200).send();
  });
}

function getReset(req, res) {
  debug("start getReset");

  if (req.isAuthenticated()) {
    debug("end getReset");
    return res.status(400).send({
      message: "Already authenticated",
      valid: false,
    });
  } else {
    User.findOne({ resetPasswordToken: req.params.token })
      .where("resetPasswordExpires")
      .gt(Date.now())
      .exec(function (error, user) {
        if (error) {
          return res.status(400).send(error);
        }
        if (!user) {
          debug("end getReset");
          return res.status(400).send({
            message: "Password reset token is invalid or has expired.",
            valid: false,
          });
        }
        debug("end getReset");
        res.status(200).send({
          message: "token is valid",
          valid: true,
        });
      });
  }
}
function getactivationlink(req, res) {
  console.log("get activation called");
  console.log(req.params.activationlink);

  debug("start getReset");
  // var a = checkAlreadyActivated(req, res)
  // console.log('a ', a)
  if (checkAlreadyActivated(req, res) == "true") {
    console.log("Sss");
    return res.status(400).send({
      message: "Already Exists.",
      valid: false,
    });
  } else {
    console.log("else");
    User.findOne({ activationlinktoken: req.params.activationlink })
      .where("activationlinkexpires")
      .gt(Date.now())
      .exec(function (error, user) {
        if (error) {
          return res.status(400).send(error);
        }
        if (!user) {
          debug("end getReset");
          return res.status(400).send({
            message: "Activation Link is invalid or has expired.",
            valid: false,
          });
        }
        user.isEmailVerified = true;
        user.save(function (error) {
          //callback(error, user)
          //   if(err){
          //   console.log('errr ',err)
          // }
        });
        console.log("Elase activate ", user);
        debug("end getReset");
        res.status(200).send({
          message: "Congrats, Your Email has been verified successfully!.",
          valid: true,
        });
      });
  }

  // if (req.isAuthenticated()) {
  //   debug('end getReset')
  //   return res.status(400).send({
  //     message: 'Already authenticated',
  //     valid: false
  //   })
  // }
}

function checkAlreadyActivated(req, res) {
  User.findOne({ activationlinktoken: req.params.activationlink }, function (
    err,
    cred
  ) {
    console.log("istrue ", cred);
    if (cred.isEmailVerified == "true") {
      console.log("cred.isEmailVerified==true");
      return "true";
      // return res.status(400).send({
      //   message: 'Congrats, Your Email has been verified successfully!.',
      //   valid: false
      // })
    }
  });
}
function postReset(req, res, next) {
  debug("start postReset");
  console.log("postReset called");
  console.log(req.body);

  req.assert("password", "Password must be at least 4 characters long.").len(4);
  req
    .assert("confirmPassword", "Passwords must match.")
    .equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    debug("end postReset");
    return res.status(400).send({ message: errors });
  } else {
    auto(
      {
        user: function (callback) {
          User.findOne({ resetPasswordToken: req.params.token })
            .where("resetPasswordExpires")
            .gt(Date.now())
            .exec(function (error, user) {
              if (error) {
                return next(error);
              }
              if (!user) {
                console.log("Not USER");
                return res.status(400).send({
                  message:
                    "no user found to reset password for. please hit reset password to get another token",
                });
              }
              user.password = req.body.password;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save(function (error) {
                if (error) {
                  return next(error);
                }
                req.logIn(user, function (error) {
                  callback(error, user);
                });
              });
            });
        },
        sendEmail: [
          "user",
          function (results, callback) {
            mail.send(
              {
                to: results.user.email,
                subject: settings.email.templates.reset.subject,
                text: settings.email.templates.reset.text(results.user.email),
              },
              function (error) {
                callback(error, true);
              }
            );
          },
        ],
      },
      function (error, user) {
        if (error) {
          return next(error);
        }
        delete user.password;
        var redirect = req.body.redirect || "/";
        debug("end postReset");
        return res
          .status(200)
          .send(exports.createResponseObject(user, "", redirect));
      }
    );
  }
}

function postForgot(req, res, next) {
  debug("start postForgot");

  req.assert("email", "Please enter a valid email address.").isEmail();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  auto(
    {
      token: function (done) {
        crypto.randomBytes(16, function (error, buf) {
          var token = buf.toString("hex");
          done(error, token);
        });
      },
      user: [
        "token",
        function (results, callback) {
          User.findOne({ email: req.body.email.toLowerCase() }, function (
            error,
            user
          ) {
            if (error) {
              debug("end postForgot");
              return res.status(400).send(error);
            }
            if (!user) {
              debug("end postForgot");
              return res.status(200).send("/forgot");
            }
            user.resetPasswordToken = results.token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            user.save(function (error) {
              callback(error, user);
            });
          });
        },
      ],
      sendEmail: [
        "user",
        function (results, callback) {
          mail.send(
            {
              to: results.user.email,
              from: "noreply@mydurity.com",
              subject: settings.email.templates.forgot.subject,
              text: settings.email.templates.forgot.text(
                "localhost:4200",
                results.token
              ),
            },
            function (error) {
              callback(error, true);
            }
          );
        },
      ],
    },
    function (error) {
      if (error) {
        return next(error);
      }
      debug("end postForgot");
      return res.status(200).send({ message: "Email has been sent" });
    }
  );
}

function getKey(req, res, next) {
  debug("start getKey");
  return res.json({ token: tokenApi.createKey(req.user) });
}

function postKey(req, res, next) {
  debug("start postKey");
  var token = tokenApi.createKey(req.user);
  res.cookie("token", token);
  debug("start postKey");
  return res.json({ token: token });
}

function getKeyReset(req, res, next) {
  debug("start getKeyReset");
  req.user.apikey = uuid.v4();
  req.user.save(function (error) {
    debug("start getKeyReset");
    if (error) return res.status(500).send(error);
    return res.json({ token: tokenApi.createKey(req.user) });
  });
}

function sendMailToHelpCenter(req,res){
 
  mail.send({
  //please give the mail id of the receiving end in the 'to' field
  to: 'hello@durity.life',
    subject: req.body.mailContents.subject,
      text: 'From: '+req.body.mailContents.email+'     Description: '+req.body.mailContents.description,
        from: 'hello@durity.life'
    },
  function(error) {
    console.log(error);
  });
  return res.status(200).send("mail sent");   
}

function checkLoginInformation(req, res, next) {
  debug("start checkLoginInformation");
  var redirect = req.body.redirect || false;
  req.assert("email", "Email is not valid").isEmail();
  req.assert("password", "Password cannot be blank").notEmpty();
  //req.sanitize('email').normalizeEmail({ remove_dots: false })

  var errors = req.validationErrors();
  if (errors) {
    debug(
      "end checkLoginInformation - Authentication failed. " + errors[0].message
    );
    return res.status(401).send({
      success: false,
      authenticated: false,
      message: errors[0].message,
      redirect: "/signin",
    });
  } else {
    passport.authenticate("local", function (error, user, info) {
      if (error) return next(error);
      if (!user) {
        debug("end checkLoginInformation");
        return res.status(400).send({
          success: false,
          authenticated: false,
          message: info.message,
          redirect: redirect,
        });
      }
      req.logIn(user, function (error) {
        if (error) return next(error);
        debug("end checkLoginInformation");
        next();
      });
    })(req, res, next);
  }
}

function createResponseObject(user, token, redirect) {
  debug("start createResponseObject");
  return {
    success: !!user,
    authenticated: !!user,
    user: user
      ? {
          profile: user.profile,
          connected: user.connected || {},
          roles: user.roles,
          gravatar: user.gravatar,
          email: user.email,
          _id: user._id,
          durity_id: user.durity_id,
        }
      : {},
    token: token,
    redirect: redirect || false,
    configuration: {
      isUserEncryptionEnabled: user.configuration.userEncryption.isEnabled,
      userEncryptionHash: user.configuration.userEncryption.passwordHash,
      signupProcessCompleted: user.configuration.signupProcessCompleted,
    },
  };
}

function duplicateFileNameCheck(req, res) {
  // console.log("############");
  //console.log(req.body);
  Grid1.findOne(
    {
      filename: req.body.options.fileName,
      "metadata.user_id": req.query.user_id,
    },
    function (err, file) {
      if (err) {
        return res.status(400).send(err);
      } else if (!file) {
        // console.log(file);
        console.log("True");
        postFiles(req, res);
      } else {
        console.log("False");
        return res
          .status(422)
          .send({ message: "File with that name already exists" });
      }
    }
  );
}

function duplicateFileNameCheck1(req, res) {
  Grid1.findOne(
    {
      filename: req.body.file.title,
      "metadata.user_id": req.query.user_id,
    },
    function (err, file) {
      if (err) {
        return res.status(400).send(err);
      } else if (!file) {
        console.log(file);
        console.log("True");
        postNotes(req, res);
      } else {
        console.log("False");
        return res
          .status(422)
          .send({ message: "File with that name already exists" });
      }
    }
  );
}

function postNotes(req, res) {
  var encrypt = crypto.createCipher(algorithm, password);
  let encFileInfo = req.body.params.fileInfo;
  let hybridEncKey = req.body.params.fileInfo.hybridEncKey;
  let hybridEncIv = req.body.params.fileInfo.hybridEncIv;
  let isUserEncrypted = req.body.params.fileInfo.isUserEncrypted;
  let userFileEncIv = req.body.params.fileInfo.userFileEncIv;
  let userFileEncVersion = req.body.params.fileInfo.userFileEncVersion;
  let userFileEncKeyHash = req.body.params.fileInfo.userFileEncKeyHash;
  let userFileEncTag = req.body.params.fileInfo.userFileEncTag;
  let encryptionType = req.body.params.fileInfo.encryptionType;
  let hybridEncVersion = req.body.params.fileInfo.hybridEncVersion;
  let hybridEncTag = req.body.params.fileInfo.hybridEncTag;
  let isBiometricEnabled = req.body.params.fileInfo.isBiometricEnabled
  var title = req.body.file.title;
  var path = __dirname + "/editorFiles" + "/" + req.query.user_id + "_" + title;
  console.log(path);
  //var path = 'H:/Vigilare/DurityNewServer/demotest/server/modules/users/editorFiles'+'/'+req.query.user_id+'_'+title+'.html'
  var stream = fs.createWriteStream(path);

  stream.once("open", function (fd) {
    stream.write(req.body.file.data);
    stream.end();
  });

  let beneficiaries = null;
  console.log(req.body.beneficiaries);
  if (req.body.beneficiaries != null) {
    beneficiaries = req.body.beneficiaries;
  }
  let userDate = req.body.userDateAndTime;

  mongoose.createConnection(
    "mongodb://127.0.0.1:27017/prod"
  );
  var conn = mongoose.connection;

  var Grid = require("gridfs-stream");
  Grid.mongo = mongoose.mongo;

  //conn.once('open', function () {
  console.log("open");
  var gfs = Grid(conn.db);

  // streaming to gridfs
  //filename to store in mongodb
  var writestream = gfs.createWriteStream({
    filename: title,
    metadata: { user_id: req.query.user_id, status: "true" },
    //content_type: 'application/pdf',
    mode: "w",
  });
  fs.createReadStream(path).pipe(encrypt).pipe(writestream);

  writestream.on("close", function (file) {
    // do something with `file`
    console.log(file.filename + "Written To DB");

    //delete the local file
    deleteLocalFile(req, res, path);
    var files = new myfiless({
      user_id: req.query.user_id,
      filename: file.filename,
      file_id: file._id,
      uploaded_user_date: userDate,
      hybridEncKey: hybridEncKey,
      hybridEncIv: hybridEncIv,
      status: true,
      isUserEncrypted: isUserEncrypted,
      userFileEncIv: userFileEncIv,
      userFileEncVersion: userFileEncVersion,
      userFileEncKeyHash: userFileEncKeyHash,
      userFileEncTag: userFileEncTag,
      encryptionType: encryptionType,
      hybridEncVersion: hybridEncVersion,
      hybridEncTag: hybridEncTag,
      isBiometricEnabled: isBiometricEnabled
    });

    files.save(function (error, result) {
      console.log("Your File has been saved!");
      defaultLevelSave(req, res, file._id);
      console.log("Res ", result);

      if (beneficiaries != null && Array.isArray(beneficiaries)) {
        beneficiaries.forEach(function (obj) {
          myFilesModule.addBeneficery(
            files.file_id,
            obj.contact_id,
            files.user_id,
            files.filename,
            obj.tier,
            encFileInfo.hybridEncKey,
            encFileInfo.hybridEncIv
          );
        });
      }

      res.status(200).send(result);
      if (error) {
        console.error(error);
      }
    });
  });
}

function postFiles(req, res, next) {
  debug("start postFiles");

  console.log("postFiles");
  console.log(req.file);
  getcount(req, res, next);
}

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    console.log("reg multer start" + file);
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

var upload = multer({
  //multer settings
  storage: storage,
}).single("file");

// function postUploadFiles(req, res, count, next) {
//  // console.log("Post upload files called ", req.file);
//   // let encFileInfo = JSON.parse(req.body.fileInfo);
//   // console.log("*************************");
//   // console.log(req.body.fileSizeInBytes);
//   // console.log(encFileInfo);
//   var encrypt = crypto.createCipher(algorithm, password);
//   var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/prod')
//   Grid.mongo = mongoose.mongo;
//   let beneficiaries = null;
//   if (req.body.beneficiaries != null) {
//     beneficiaries = JSON.parse(req.body.beneficiaries);
//   }
//   console.log(req.body.beneficiaries);
//   let userDate = req.body.userDateAndTime;
//   let original_fileSize = req.body.fileSizeInBytes;
//   conn.once("open", function() {
//     var gfs = Grid(conn.db);

//     console.log("reg start");

//     upload(req, res, function(err) {
//       if (err) {
//         res.json({ error_code: 1, err_desc: err });
//         return;
//       }
//       //    res.json({error_code:0,err_desc:null});
//     });

//     var writestream = gfs.createWriteStream({
//       filename: req.file.originalname,
//       metadata: { user_id: req.query.user_id, status: "true" },
//       content_type: "application/pdf",
//       mode: "w"
//     });

//     fs.createReadStream(req.file.path)
//       .pipe(encrypt)
//       .pipe(writestream);
//     writestream.on("close", function(file) {
//       // do something with `file`
//       console.log(req.file.originalname + "Written To DB");
//       deleteLocalFile(req, res, req.file.path);
//       //console.log(req.body.date?req.body.date:'')
//       console.log(encFileInfo.hybridEncKey);
//       var files = new myfiless({
//         user_id: req.query.user_id,
//         filename: file.filename,
//         file_id: file._id,
//         original_filesize: original_fileSize,
//         uploaded_user_date: userDate,
//         status: true,
//         hybridEncKey: encFileInfo.hybridEncKey,
//         hybridEncIv: encFileInfo.hybridEncIv
//       });
//       files.save(function(error, result) {
//         if (error) {
//           console.error("file.save ", error);
//         }
//         console.log("res " + result);
//         //res.json({error_code:0,count:count, result: result});
//         console.log({ error_code: 0, count: count, result: result });

//         console.log("Your File has been saved!");

//         if (beneficiaries != null) {
//           beneficiaries.forEach(function(obj) {
//             myFilesModule.addBeneficery(
//               files.file_id,
//               obj.contact_id,
//               files.user_id,
//               files.filename,
//               obj.tier,
//               encFileInfo.hybridEncKey,
//               encFileInfo.hybridEncIv
//             );
//           });
//         }
//         console.log("The res is ", result);

//         defaultLevelSave(req, res, file._id);

//         res.send(result);
//       });
//     });
//   });
// }

function postUploadFiles(req, res, count, next) {
  let title = req.body.options.params.originalname;
  var encrypt = crypto.createCipher(algorithm, password);
  mongoose.createConnection(
    "mongodb://127.0.0.1:27017/prod"
  );
  var conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;
  let beneficiaries = null;
  if (req.body.options.params.beneficiaries != null) {
    beneficiaries = req.body.options.params.beneficiaries;
  }
  let hybridEncKey = req.body.options.params.fileInfo.hybridEncKey;
  let hybridEncIv = req.body.options.params.fileInfo.hybridEncIv;
  let userDate = req.body.options.params.userDateAndTime;
  let original_fileSize = req.body.options.params.fileSizeInBytes;
  let fileChecksum = req.body.options.params.fileChecksum;
  let checksumType = req.body.options.params.checksumType;
  let filename = req.body.options.fileName;
  // let tag = req.body.options.params.tag;
  // let fileInfoBody = req.body.options.params.fileInfo;
  let isUserEncrypted = req.body.options.params.fileInfo.isUserEncrypted;
  let userFileEncIv = req.body.options.params.fileInfo.userFileEncIv;
  let userFileEncVersion = req.body.options.params.fileInfo.userFileEncVersion;
  let userFileEncKeyHash = req.body.options.params.fileInfo.userFileEncKeyHash;
  let userFileEncTag = req.body.options.params.fileInfo.userFileEncTag;
  let encryptionType = req.body.options.params.fileInfo.encryptionType;
  let hybridEncVersion = req.body.options.params.fileInfo.hybridEncVersion;
  let hybridEncTag = req.body.options.params.fileInfo.hybridEncTag;
  let isBiometricEnabled = req.body.options.params.fileInfo.isBiometricEnabled;
  // conn.once("open", function() {
  var gfs = Grid(conn.db);

  console.log("reg start");

  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    //    res.json({error_code:0,err_desc:null});
  });
  var path = __dirname + "/editorFiles" + "/" + req.query.user_id + "_" + title;
  console.log(path);
  var stream = fs.createWriteStream(path);
  console.log("started readstream");
  stream.once("open", function (fd) {
    stream.write(req.body.fileData);
    stream.end();
  });

  var writestream = gfs.createWriteStream({
    filename: title,
    metadata: { user_id: req.query.user_id, status: "true" },
    content_type: "application/pdf",
    mode: "w",
  });

  fs.createReadStream(path).pipe(encrypt).pipe(writestream);

  writestream.on("close", function (file) {
    // do something with `file`
    console.log("Written To DB");

    deleteLocalFile(req, res, path);

    var files = new myfiless({
      user_id: req.query.user_id,
      filename: filename,
      file_id: file._id,
      original_filesize: original_fileSize,
      uploaded_user_date: userDate,
      status: true,
      isUserEncrypted:isUserEncrypted,
      userFileEncIv:userFileEncIv,
      userFileEncVersion:userFileEncVersion,
      userFileEncKeyHash:userFileEncKeyHash,
      userFileEncTag:userFileEncTag,
      encryptionType:encryptionType,
      hybridEncVersion:hybridEncVersion,
      // tag:tag,
      fileChecksum: fileChecksum,
      checksumType: checksumType,
      hybridEncTag:hybridEncTag,
      hybridEncKey: hybridEncKey,
      hybridEncIv: hybridEncIv,
      isBiometricEnabled: isBiometricEnabled
    });
    // console.log("tag : ",fileInfoBody.hybridEncTag);

    files.save(function (error, result) {
      if (error) {
        console.error("file.save ", error);
      }

      //res.json({error_code:0,count:count, result: result});
      console.log({ error_code: 0, count: count, result: result });

      console.log("Your File has been saved!");

      if (beneficiaries != null) {
        beneficiaries.forEach(function (obj) {
          myFilesModule.addBeneficery(
            files.file_id,
            obj.contact_id,
            files.user_id,
            filename,
            obj.tier,
            hybridEncKey,
            hybridEncIv
          );
        });
      }
      console.log("The res is ", result);

      defaultLevelSave(req, res, file._id);

      res.send(result);
    });
  });
  // });
}


function postUploadWillFile(req,res,next) {
  
  var encrypt = crypto.createCipher(algorithm, password);
  var conn = mongoose.createConnection(
    "mongodb://127.0.0.1:27017/prod"
  );
  //mongoose.createConnection(dbSetting.mongoFileConnection);
  Grid.mongo = mongoose.mongo;
  let beneficiaries = null;
  User.findOne({ email: req.email }, function(error, user){
    
    conn.once("open", function() {
      var gfs = Grid(conn.db);
      console.log("reg start");
      var writestream = gfs.createWriteStream({
        filename: req.options.fileName,
        metadata: { user_id: user.id, status: "true" },
        content_type: "application/pdf",
        mode: "w"
      });
      fs.createReadStream(req.fileUrl)
        .pipe(encrypt)
        .pipe(writestream);
      writestream.on("close", function(file) {
        // do something with `file`
        console.log(req.options.fileName + "Written To DB");
        var files = new myfiless({
          user_id: user.id,
          filename: req.options.fileName,
          uploaded_user_date: req.options.userDateAndTime,
          isEncrypted:false,
          file_id: file._id,
          status: true,
        });
        files.save(function(error, result) {
          if (error) {
            console.error("file.save ", error);
          }
          console.log("res " + result);
          // console.log({ error_code: 0, count: count, result: result });
          console.log("Your File has been saved!");
          if (beneficiaries != null) {
            beneficiaries.forEach(function(obj) {
              myFilesModule.addBeneficery(
                files.file_id,
                obj.contact_id,
                user.id,
                files.filename,
                obj.tier,
                encFileInfo.hybridEncKey,
                encFileInfo.hybridEncIv
              );
            });
          }
          // return result;
          console.log("The res is ", result);
          res = result;
          console.log("%%%%%"+res);
          return result
        });
      });
    })
    
  })
}

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/* Function used to get all the uploaded files list from DB */
function viewlist(req, res, next) {
  mongoose.createConnection(
    "mongodb://127.0.0.1:27017/prod"
  );

  Grid1.find(
    { metadata: { user_id: req.query.user_id, status: "true" } },
    function (err, gridfiles) {
      if (err) throw err;
      console.log(gridfiles);

      return res.send(gridfiles);
    }
  );
}

function getcount(req, res, next) {
  console.log("Get count executed");
  //console.log(req.file);
  mongoose.createConnection(
    "mongodb://127.0.0.1:27017/prod"
  );

  //Hard coding for ui purpose
  Grid1.find({ metadata: { user_id: req.query.user_id, status: "true" } })
    //mongoose.connection.close();
    .count(function (err, count) {
      if (err) throw err;
      console.log(count);
      // return res.write("The count is"+gridfiles)
      if (count < 3000) {
        postUploadFiles(req, res, count, next);
      } else {
        return res.json({
          error_code: 1,
          count: count,
          result: "LIMIT EXCEEDED",
        });
      }

      //return  res.json({count :count});
    });
}

function getFileById(req, res) {
  var decrypt = crypto.createDecipher(algorithm, password);
  var role = req.session;
  var conn = mongoose.connection;
  var gfs = Grid(conn.db, mongoose.mongo);

  Grid1.findOne({ _id: req.params.fileId }, function (err, file) {
    //5e2c2aa68740b55b11228906
    // console.log(file);
    if (err) {
      return res.status(400).send(err);
    } else if (!file) {
      return res
        .status(404)
        .send("Error on the database looking for the file.");
    }

    res.mydata = {};
    var readstream = gfs.createReadStream({
      _id: req.params.fileId,
    });

    readstream.on("error", function (err) {
      res.end();
    });

    res.set("Content-Type", file._doc.contentType);
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file._doc.filename + '"'
    );
    readstream.pipe(decrypt).pipe(res);
  });
}

function getKeysById(req, res) {
  myfiless.findOne({ file_id: req.params.fileId }, function (err, resFromDB) {
    if (err) {
      return res.status(400).send(err);
    } else if (!resFromDB) {
      return res
        .status(404)
        .send("Error on the database looking for the file.");
    }
    if (resFromDB["hybridEncKey"] != "") {
      axios
      .post(settings.validationServerIP + "getKeysById", {
          key: resFromDB["hybridEncKey"],
          iv: resFromDB["hybridEncIv"],
          // mobileNumber: req.body.mobileNumber,
          // otp: req.body.otp,
        })
        .then(function (response) {
          console.log(response.data);
          return res.status(200).send({
            hybridEncKey: response.data.key,
            hybridEncIv: response.data.iv,
          });
        })
        .catch(function (error) {
          res.status(400).send(error.response.data);
        });
    }
  });
}

// function verifyOTPandGetKeysById(req, res) {
//   myfiless.findOne({ file_id: req.body.fileId }, function (err, resFromDB) {
//     if (err) {
//       return res.status(400).send(err);
//     } else if (!resFromDB) {
//       return res
//         .status(404)
//         .send("Error on the database looking for the file.");
//     }
//     if (resFromDB["hybridEncKey"] != "") {
//       axios
//         .post(settings.validationServerIP + "verifyOTPandGetKeys", {
//           key: resFromDB["hybridEncKey"],
//           iv: resFromDB["hybridEncIv"],
//           mobileNumber: req.body.mobileNumber,
//           otp: req.body.otp,
//         })
//         .then(function (response) {
//           console.log(response.data);
//           return res.status(200).send({
//             hybridEncKey: response.data.key,
//             hybridEncIv: response.data.iv,
//           });
//         })
//         .catch(function (error) {
//           res.status(400).send(error.response.data);
//         });
//     }
//   });
// }

function verifyOTPandGetKeysById(req, res) {
  myfiless.findOne({ file_id: req.body.fileId }, function (err, resFromDB) {
    if (err) {
      return res.status(400).send(err);
    } else if (!resFromDB) {
      return res
        .status(404)
        .send("Error on the database looking for the file.");
    }
    if (resFromDB["hybridEncKey"] != "") {
      axios
        .post(settings.validationServerIP + "verifyOTPandGetKeys", {
          key: resFromDB["hybridEncKey"],
          iv: resFromDB["hybridEncIv"],
          mobileNumber: req.body.mobileNumber,
          otp: req.body.otp,
        })
        .then(function (response) {
         
          return res.status(200).send({
            hybridEncKey: response.data.key,
            hybridEncIv: response.data.iv,
          });
        })
        .catch(function (error) {
         
          res.status(400).send(error.response.data);
        });
    }
  });
}

function getKeysById(req, res) {
  myfiless.findOne({ file_id: req.params.fileId }, function (err, resFromDB) {
    if (err) {
      return res.status(400).send(err);
    } else if (!resFromDB) {
      return res
        .status(404)
        .send("Error on the database looking for the file.");
    }
    if (resFromDB["hybridEncKey"] != "") {
      axios
        .post(settings.validationServerIP + "getKeysById", {
          key: resFromDB["hybridEncKey"],
          iv: resFromDB["hybridEncIv"],
          // mobileNumber: req.body.mobileNumber,
          // otp: req.body.otp,
        })
        .then(function (response) {
          console.log(response.data);
          return res.status(200).send({
            hybridEncKey: response.data.key,
            hybridEncIv: response.data.iv,
          });
        })
        .catch(function (error) {
          res.status(400).send(error.response.data);
        });
    }
  });
}


function deleteLocalFile(req, res, path) {
  fs.stat(path, function (err, stats) {
    //console.log(stats);

    if (err) {
      return console.error(err);
    }

    if (stats != null) {
      fs.unlink(path, function (err) {
        if (err) return console.log(err);
        console.log("file deleted successfully");
      });
    }
  });
}

function notifymail(req, res, next) {
  console.log("NOTIFY CALLED");
  console.log(req.body);

  User.findOne({ _id: req.query.user_id }, function (err, userDetails) {
    console.log("Name ", userDetails.profile.name);
    getBeneficiaryDetails(req, res, userDetails.profile.name);
  });
}

function getBeneficiaryDetails(req, res, senderName) {
  var ben1 = [];
  var ben2 = [];
  var ben3 = [];
  myfiless.findOne({ file_id: req.body.attachment.file_id }, function (
    err,
    det
  ) {
    console.log("dett ", det.Beneficiary1.contactId);
    for (var i = 0; i < det.Beneficiary1.length; i++) {
      console.log("Cid ", det.Beneficiary1[i].contactId);
      ben1.push(det.Beneficiary1[i].contactId);
    }
    for (var j = 0; j < det.Beneficiary2.length; j++) {
      console.log("Cid ", det.Beneficiary2[j].contactId);
      ben2.push(det.Beneficiary2[j].contactId);
    }
    for (var k = 0; k < det.Beneficiary3.length; k++) {
      console.log("Cid ", det.Beneficiary3[k].contactId);
      ben3.push(det.Beneficiary3[k].contactId);
    }

    getBenEmailAddress(req, res, ben1, ben2, ben3, senderName);
  });
}

function getBenEmailAddress(req, res, ben1, ben2, ben3, senderName) {
  console.log("BBB ", ben1, ben2, ben3);
  if (ben1.length > 0) {
    for (var i = 0; i < ben1.length; i++) {
      Contactss.findOne({ _id: ben1[i] }, function (err, id) {
        console.log("*** ", id.primaryEmail);
        sendEmailNotification(
          req,
          res,
          id.firstName,
          id.primaryEmail,
          "Level 1",
          senderName
        );
      });
    }
  }
  if (ben2.length > 0) {
    for (var j = 0; j < ben2.length; j++) {
      Contactss.findOne({ _id: ben2[j] }, function (err, id) {
        console.log("*** ", id.primaryEmail);
        sendEmailNotification(
          req,
          res,
          id.firstName,
          id.primaryEmail,
          "Level 2",
          senderName
        );
      });
    }
  }

  if (ben3.length > 0) {
    for (var k = 0; k < ben3.length; k++) {
      Contactss.findOne({ _id: ben3[k] }, function (err, id) {
        console.log("*** ", id.primaryEmail);
        sendEmailNotification(
          req,
          res,
          id.firstName,
          id.primaryEmail,
          "Level 3",
          senderName
        );
      });
    }
  }
}

function sendEmailNotification(req, res, name, email, level, senderName) {
  // `<b>Dear `+name+`, <br> <br> named `+req.body.attachment.filename+`
  var template =
    `<b>Dear One, <br> <br>
  This is to inform you that I'm storing my confidential information in Durity for you.<br><br>
  In-case of an emergency, please contact https://mydurity.com to get the documents.<br><br>
  I also recommend that you create your own Durity account and safeguard your loved one's future.<br>
  Kindly store this email safely.<br><br>

 Regards, <br>
 ` +
    senderName +
    `</b>`;

  var mailOptions = {
    to: email,
    from: settings.email.from,
    subject: "Contact notification mail from Durity",
    html: template,
  };

  transporter.sendMail(mailOptions, function (error) {
    console.log("transporter mail");
    if (error) console.log(error);
    //    cb(error)
  });
}

function defaultLevelSave(req, res, file_id) {
  console.log("Default Level ");
  Contactss.find({ user_id: req.query.user_id, level: "tier 1" }, function (
    err,
    contactdetails
  ) {
    if (err) res.send(err);
    for (var i = 0; i < contactdetails.length; i++) {
      console.log(" C length ", contactdetails.length);
      console.log(" Contact Details ", contactdetails[i]._id.toString());

      myfiless.update(
        { file_id: file_id },
        {
          $push: {
            //rename to type..
            Beneficiary1: {
              status: "true",
              shared_on: new Date(),
              contactId: contactdetails[i]._id.toString(),
            },
          },
        },
        { upsert: true },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully Pushed");
          }
        }
      );
    }
  });
  Contactss.find({ user_id: req.query.user_id, level: "tier 2" }, function (
    err,
    contactdetails
  ) {
    if (err) res.send(err);
    for (var i = 0; i < contactdetails.length; i++) {
      console.log(" C length ", contactdetails.length);
      console.log(" Contact Details ", contactdetails[i]._id);

      myfiless.update(
        { file_id: file_id },
        {
          $push: {
            //rename to type..
            Beneficiary2: {
              status: "true",
              shared_on: new Date(),
              contactId: contactdetails[i]._id.toString(),
            },
          },
        },
        { upsert: true },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully Pushed");
          }
        }
      );
    }
  });
  Contactss.find({ user_id: req.query.user_id, level: "tier 3" }, function (
    err,
    contactdetails
  ) {
    if (err) res.send(err);
    for (var i = 0; i < contactdetails.length; i++) {
      console.log(" C length ", contactdetails.length);
      console.log(" Contact Details ", contactdetails[i]._id);

      myfiless.update(
        { file_id: file_id },
        {
          $push: {
            //rename to type..
            Beneficiary3: {
              status: "true",
              shared_on: new Date(),
              contactId: contactdetails[i]._id.toString(),
            },
          },
        },
        { upsert: true },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully Pushed");
          }
        }
      );
    }
  });
}

function sendOTP(req, res) {
  axios
    .post(settings.validationServerIP + "sendOTP", {
      mobileNumber: req.body.mobileNumber,
    })
    .then(function (response) {
      return res.status(200).send({ message: "OTP SENT" });
    })
    .catch(function (error) {
      res.status(400).send(error.response.data);
    });
}

function resendOTP(req, res) {
  axios
    .post(settings.validationServerIP + "resendOTP", {
      mobileNumber: req.body.mobileNumber,
    })
    .then(function (response) {
      return res.status(200).send(response);
    })
    .catch(function (error) {
      res.status(400).send(error.response.data);
    });
}

function verifyOTP(req, res) {
  axios
    .post(settings.validationServerIP + "verifyOTP", {
      mobileNumber: req.body.mobileNumber,
      otp: req.body.otp,
    })
    .then(function (response) {
      return res.status(200).send({ message: "OTP SENT" });
    })
    .catch(function (error) {
      res.status(400).send(error.response.data);
    });
}

// function verifyOTP(req, res) {
//   sendOtp.verify(req.body.mobileNumber, req.body.otp, function(
//     error,
//     data,
//     response
//   ) {
//     console.log(data); // data object with keys 'message' and 'type'
//     if (data.type == "error") {
//       console.log("OTP verification failed");
//       return res
//         .status(400)
//         .send({ message: "Invalid OTP or OTP Expired. Try again" });
//     }
//     if (data.type == "success") {
//       console.log("OTP verified successfully");
//       User.findOneAndUpdate(
//         { _id: req.query.user_id },

//         { $set: { isMobileVerified: true } },
//         { new: true },
//         function(err, doc) {
//           if (err) {
//             console.log("error s ", err);
//             return res.status(400).send("Something wrong when deleting data!");

//             console.log("Something wrong when updating data!");
//           }
//           //console.log("Updated successfully"+doc);
//           return res.status(200).send({ message: "OTP Verified" });
//         }
//       );
//     }
//   });
// }

function getUserInfoByUserId(user_id) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: user_id }, function (error, result) {
      if (error) {
        const errorObject = {
          msg: "An error while finding user info",
          error,
          error,
        };
        reject(errorObject);
      } else {
        let res = result;
        res.password = null; //sending details except password
        resolve(res);
      }
    });
  });
}

function updateSignupProcessStatus(req, res) {
  User.findOneAndUpdate(
    { _id: req.query.user_id },
    {
      $set: {
        "configuration.signupProcessCompleted": req.body.signupProcessCompleted,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("error s ", err);
        return res.status(400).send("Something wrong while updating!");
      }
      //console.log("Updated successfully"+doc);
      return res.status(200).send(doc.configuration.signupProcessCompleted);
    }
  );
}

function getAgentKey(toDecrypt) {
  const supervisorPrivateKey = fs.readFileSync(
    "configs/supervisor_pkcs8.key",
    "utf8"
  );
  // console.log(contents === privateKey, contents, '\n', contents);
  var buffer = Buffer.from(toDecrypt, "base64");
  // console.log('Supervisor Key', toDecrypt)
  var decrypted = crypto.privateDecrypt(
    {
      key: new Buffer.from(supervisorPrivateKey),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );

  return decrypted.toString("utf8");
}

function setUserEncryptionStatus(req, res) {
  User.findOneAndUpdate(
    { _id: req.query.user_id },
    {
      $set: {
        "configuration.userEncryption.isEnabled":
          req.body.userEncryption.isEnabled,
        "configuration.userEncryption.algorithm":
          req.body.userEncryption.algorithm,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("error s ", err);
        return res.status(400).send("Something wrong while updating!");
      }

      //console.log("Updated successfully"+doc);
      return res.status(200).send(doc.configuration.addedExtraSecurity);
    }
  );
}

function setUserEncryptionPasswordHash(req, res) {
  User.findOneAndUpdate(
    { _id: req.query.user_id },
    {
      $set: {
        "configuration.userEncryption.passwordHash":
          req.body.userEncryption.passwordHash,
        "configuration.userEncryption.passwordHashAlgorithm":
          req.body.userEncryption.passwordHashAlgorithm,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("error s ", err);
        return res.status(400).send("Something wrong while updating!");
      }

      //console.log("Updated successfully"+doc);
      return res.status(200).send(doc.configuration.addedExtraSecurity);
    }
  );
}

// function testApi(req, res) {

//   return res.status(200)

// }

// Azure
// exports.getUserAzure = getUserAzure
// exports.postCallbackAzure = postCallbackAzure
// exports.getUnlinkAzure = getUnlinkAzure

// function getUserAzure (req, res, next) {
//   var outlook = require('node-outlook')
//   var token = req.user.azure ? req.user.azure.token : ''
//   outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
//   var queryParams = {
//     '$select': 'DisplayName, EmailAddress'
//   }
//   outlook.base.getUser({token: token, odataParams: queryParams}, function (error, result) {
//     if (error) {
//       res.send(error)
//     } else if (result) {
//       res.send(result)
//     }
//   })
// }

// function postCallbackAzure (req, res, next) {
//   res.redirect('/account')
// }

// function getUnlinkAzure (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.azure = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// Instagram
// exports.postCallbackInstagram = postCallbackInstagram
// exports.getUnlinkInstagram = getUnlinkInstagram

// function postCallbackInstagram (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkInstagram (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.instagram = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// Facebook
// exports.postCallbackFacebook = postCallbackFacebook
// exports.getUnlinkFacebook = getUnlinkFacebook

// function postCallbackFacebook (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkFacebook (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.facebook = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// Twitter
// exports.postCallbackTwitter = postCallbackTwitter
// exports.getUnlinkTwitter = getUnlinkTwitter

// function postCallbackTwitter (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkTwitter (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.twitter = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// GitHub
// exports.postCallbackGitHub = postCallbackGitHub
// exports.getUnlinkGitHub = getUnlinkGitHub

// function postCallbackGitHub (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkGitHub (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.gitHub = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// Google
// exports.postCallbackGoogle = postCallbackGoogle
// exports.getUnlinkGoogle = getUnlinkGoogle

// function postCallbackGoogle (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkGoogle (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.google = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }

// LinkedIn
// exports.postCallbackLinkedIn = postCallbackLinkedIn
// exports.getUnlinkLinkedIn = getUnlinkLinkedIn

// function postCallbackLinkedIn (req, res, next) {
//   res.redirect('/account')
// }
// function getUnlinkLinkedIn (req, res, next) {
//   User.findById(req.user._id, function (error, user) {
//     if (error) { return next(error) }
//     user.linkedIn = {}
//     user.save(function (error) {
//       if (error) { return next(error) }
//       res.redirect('/account')
//     })
//   })
// }
// LOOK AT CREATING SERVICE ACCOUNTS IN LATER VERSIONS
