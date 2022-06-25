var devices = require("./devices.controller");

module.exports = function (app, auth, mail, settings, models, logger) {
  app.get(
    '/api/devices/getUserDevices/:userId',
    devices.getUserDevices
  );
  app.get(
    "/api/devices/getTrusteeDetails/:userId",
    devices.getTrusteeDetails
  );
  app.post("/api/devices/addDevice", devices.addDevice);
  app.post(
    "/api/devices/addEncRandKeyToFilesWithTrusteePubKey",
    devices.addEncRandKeyToFilesWithTrusteePubKey
  );
  app.post(
    "/api/devices/deleteDevices",
    devices.deleteDevices
  );
};
