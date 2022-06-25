module.exports.addDevice = addDevice;
module.exports.getUserDevices = getUserDevices;
// module.exports.postNewEncRndKeyToFiles = postNewTrEncRndKeyToFiles; // New trusstees
module.exports.getTrusteeDetails = getTrusteeDetails; // return all existing tustees
module.exports.deleteDevices = deleteDevices;
module.exports.getTrusteePublicKey = getTrusteePublicKey;
module.exports.addEncRandKeyToFilesWithTrusteePubKey = addEncRandKeyToFilesWithTrusteePubKey;

var mongoose = require("mongoose");
var deviceModule = require('./devices.model');
var deviceModel = mongoose.model("devices")
var User = mongoose.model("users");
var Contact = mongoose.model("Contacts");
var MyFiles = mongoose.model("myfiles");

function addDevice(req, res) {
  let newDevice = new deviceModel({
    userDevices: [{
      UUID: req.body.UUID,
      keyStoreId: req.body.keyStoreId,
      publicKeyId: req.body.publicKeyId,
      operatingSystem: req.body.operatingSystem,
      deviceType: req.body.deviceType,
      deviceAddedDate: Date.now(),
    }, ],
    userId: req.body.userId,
  });
  const deviceKeysObj = {
    UUID: req.body.UUID,
    encRandKey: req.body.encRandKey,
    encRandIv: req.body.encRandIv
  };
  deviceModule.addDevice(
    newDevice.userId,
    newDevice.userDevices[0],
    (error, device) => {
      if (error)
        res.status(400).send({
          success: false,
          msg: "Failed to add device"
        });
      else if (!device) {
        newDevice.save();
        updateFilesWithNewDevice(deviceKeysObj, req.body.userId, (error, rawData) => {
          if (error) res.status(400).send(error);
          else if (rawData.matchedCount == 0) res.status(200).send({
            message: "No files to update after adding new device"
          });
          else res.status(200).send({
            message: "Files updated after adding new device"
          });
        });
      } else updateFilesWithNewDevice(deviceKeysObj, req.body.userId, (error, rawData) => {
        if (error) res.status(400).send(error);
        else if (rawData.matchedCount == 0) res.status(200).send({
          message: "No files to update after adding new device"
        });
        else res.status(200).send({
          message: "Files updated after updating existing device"
        });
      });
    }
  );
}

function updateFilesWithNewDevice(deviceKeysObj, userId, callback) {
  MyFiles.updateMany({
    user_id: userId
  }, {
    $push: {
      hybridEncKeysAndIvs: deviceKeysObj
    }
  }, callback);
}

function getUserDevices(req, res) {
  const userId = req.params.userId;
  deviceModule.getUserDevices(userId, (error, device) => {
    if (error)
      res.status(400).send({
        success: false,
        msg: "Failed to get device"
      });
    else res.status(200).send(device.userDevices);
  });
}

function getTrusteeDurityUserId(email, telephoneNumber, callback) {
  const query = {
    'email': email,
    'profile.telephoneNumber': telephoneNumber
  };
  User.findOne(query, callback);
}

function getTrusteePublicKey(req, res) {
  getTrusteeDurityUserId(req.body.email, req.body.telephoneNumber, (error, user) => {
    if (error) res.status(400).send(error);
    else if (!user) res.status(400).send({
      message: "Trustee not yet registered"
    });
    else {
      deviceModel.findOne(user.user_id, (error, trusteeDevices) => {
        if (error) res.status(400).send(error);
        else if (trusteeDevices) res.status(200).send(trusteeDevices);
        else res.status(400).send({
          message: "userId exists but no devce found"
        });
      });
    }
  });
}

function getContactId(contact, userId, callback) {
  const query = {
    user_id: userId,
    $mobilePhone: contact
  };
  Contact.findOne(query, callback);
}

function addEncRandKeyToFilesWithTrusteePubKey(req, res) {
  getContactId(req.body.contact, req.body.userId, (error, contact) => {
    if (error) res.status(400).send(error);
    else if (!contact) res.status(400).send({
      message: "Did not find contactId"
    });
    else {
      const query = {
        user_id: req.body.userId,
        Beneficiary1: {
          $elemMatch: {
            contactId: contact._id
          }
        }
      }
      MyFiles.findOneAndUpdate(query, {
        $push: {
          hybridEncKeysAndIvs: elementToPush
        }
      }, (error, file) => {
        if (error) res.status(400).send(error);
        else if (!file) res.status(400).send({
          message: "File not found to update with trustee public key"
        });
        else res.status(400).send({
          message: "File has updated with trustee public key"
        });
      });
    }
  });
}

// To check number of trustees.
function getTrusteeDetails(req, res) {
  let trusteesInDurity = [];
  const userId = req.params.userId;
  //trusteesOfUser contains usesId and trustees contactId
  MyFiles.aggregate([{
      $match: {
        user_id: userId
      }
    },
    {
      $group: {
        _id: userId,
        trusteeContactId: {
          $push: "$Beneficiary1.contactId",
        },
      },
    },
    {
      $project: {
        trusteeContactId: {
          $reduce: {
            input: "$trusteeContactId",
            initialValue: [],
            in: {
              $setUnion: ["$$value", "$$this"]
            },
          },
        },
      },
    },
  ],  function (err, result) {
    if (err) {
      res.status(400).send({
        success: false,
        msg: "Error while finding contact using aggregation",
      });
    }
    const trusteesInDurity = findTrusteesInDurity(result[0].trusteeContactId, res)
    if (!trusteesInDurity.length)
      res.status(200).send({
        success: true,
        msg: "Trustee did not registered in Durity"
      });
    else res.status(200).send(trusteesInDurity);
  });
}

async function findTrusteesInDurity(trustees, res) {
  let temp = [];
  for (const trusteeContactId of trustees) {
    if (trusteeContactId != "") {
      try {
        let contact = await Contact.findById(trusteeContactId);
        let user = await User.findOne({
          email: contact.primaryEmail
        });
        temp.push(user);

      } catch (error) {
        res.status(400).send({
          success: false,
          msg: "Error while finding trustees in durity",
          error: error.stack
        });
      }
    }
  }
  return temp;
}

function deleteDevices(req, res) {
  deviceModule.deleteDevice(req.body.userId, req.body.UUID, (error, device) => {
    if (error)
      res.status(400).send({
        success: false,
        message: "Error while deleting device element from devices array"
      });
    else res.status(200).send({
      success: false,
      message: "Deleted successfully"
    })
  });
}

// function deleteTrustee(req, res) {

// }

// async function findTrusteesInDurity(trustees, res) {
//   let temp = [];
//   for (const trusteeContactId of trustees) {
//     if (trusteeContactId != "") {
//       await Contact.findById(trusteeContactId,  (error, contact) => {
//         if (error)
//           res.status(400).send({
//             success: false,
//             msg: "Error while finding contact by trustee contactId",
//           });
//         else if (contact) {
//           // trusteeEmails.push(contact.primaryEmail);
//           await User.findOne({
//             email: contact.primaryEmail
//           }, (error, user) => {
//             if (error)
//               res.status(400).send({
//                 success: false,
//                 msg: "Error while finding User by trustee primary email",
//               });
//             else if (user) temp.push(user);
//           });
//         }
//       });
//     }
//   }
//   return temp;
// }