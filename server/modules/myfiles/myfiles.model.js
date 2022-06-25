var mongoose = require("mongoose");
var __name__Schema = mongoose.Schema({
  user_id: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    default: ""
  },
  isEncrypted: {
    type: Boolean,
    default: true
  },
  uploaded_user_date: {
    type: String,
    default: ""
  },
  upload_server_date: {
    type: Date,
    default: Date.now
  },
  filename: {
    type: String,
    default: ""
  },
  original_filesize: {
    type: String,
    default: ""
  },
  file_id: {
    type: String,
    default: ""
  },
  fileChecksum: {
    type: String,
    default: ""
  },
  checksumType: {
    type: String,
    default: ""
  },
  encryptionType: {
    type: String,
    default: ""
  },
  isBiometricEnabled: {
    type: Boolean,
    default: false
  },
  hybridEncVersion: {
    type: String,
    default: ""
  },
  originalFileExtension: {
    type: String,
    default: ""
  },
  userFileEncTag: {
    type: String,
    default: ""
  },
  userFileEncKeyHash: {
    type: String,
    default: ""
  },
  userFileEncVersion: {
    type: String,
    default: ""
  },
  userFileEncIv: {
    type: String,
    default: ""
  },
  isUserEncrypted: {
    type: Boolean,
    default: false
  },
  Beneficiary1: {
    type: Array,
    default: [],

    contactId: {
      type: String,
      default: ""
    },

    shared_on: {
      type: Date,
      default: ""
    },
    status: {
      type: Boolean,
      default: ""
    }
  },
  Beneficiary2: {
    type: Array,
    default: [],

    contactId: {
      type: String,
      default: ""
    },

    shared_on: {
      type: Date,
      default: ""
    },
    status: {
      type: Boolean,
      default: ""
    }
  },
  Beneficiary3: {
    type: Array,
    default: [],

    contactId: {
      type: String,
      default: ""
    },

    shared_on: {
      type: Date,
      default: ""
    },
    status: {
      type: Boolean,
      default: ""
    }
  },
  hybridEncTag: {
    type: String,
  //   required: true,
    default: ''
  },
  hybridEncKey: {
      type: String,
    //   required: true,
      default: ''
  },
  hybridEncIv: {
    type: String,
    // required: true,
    default: ''
}
});
module.exports = __name__Schema;
