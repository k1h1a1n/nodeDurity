var mongoose = require("mongoose");
var deviceSchema = mongoose.Schema({
  _comment: {
    type: String,
    default: "Devices and keys related to user",
  },
  userDevices: Array,
  userId: String,
}, {
  toObject: {
    versionKey: false
  }
});

module.exports = deviceSchema;
const Device = mongoose.model("device", deviceSchema)

module.exports.getUserDevices = function (userId, callback) {
  const query = {
    userId: userId
  };
  Device.findOne(query, callback);
};

module.exports.addDevice = function (userId, elementToPush, callback) {
  const query = {
    userId: userId,
    userDevices: {
      $elemMatch: {
        UUID: elementToPush.UUID
      }
    },
  };
  console.log(query);
  Device.findOneAndUpdate(
    query, {
      $push: {
        userDevices: elementToPush
      }
    },
    callback
  );
};

module.exports.updateDevice = function (userId, elementToPush, callback) {
  const query = {
    userId: userId
  };
  Device.updateOne(query, {
    $push: {
      devices: elementToPush
    }
  }, callback);
};

module.exports.deleteDevice = function (userId, UUID, callback) {
  const query = {
    userId: userId
  };
  Device.updateOne(query, {
    $pull: {
      devices: {
        UUID: UUID
      }
    }
  }, callback);
};