var mongodbUri = process.env.DB_PORT_27017_TCP_ADDR || process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/prod'
// var mongodbUri = process.env.DB_PORT_27017_TCP_ADDR || process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/admin?authSource=admin'
module.exports = {
  minify: 'minify', // 'concat' all files or 'minify' concat and minfy  or 'default' leave as is
  html: {
    title: 'MEANSTACKJS'
  },
  logger: 'combined',
  cdn: process.env.CDN || false,
  buildreq: {
    console: false
  },
  maxcdn: {
    zoneId: process.env.MAXCDN_ZONE_ID || false
  },
  mongoexpress: {
    port: process.env.MONGOEXPRESSPORT || 8081
  },
  socketio: {
    port: process.env.SOCKETIOPORT || 8282
  },
  http: {
    active: true,
    port: process.env.PORT || 8888
  },
  https: {
    active: true,
    redirect: true,
    port: process.env.HTTPSPORT || 9999,
    key: './configs/certificates/pkey.pem',
    cert: './configs/certificates/cert.pem',
	requestCert: false
   
	  
},
  throttle: {
    rateLimit: {
      ttl: 600,
      max: 1000
    },
    mongoose: {
      uri: mongodbUri
    }
  },
  mongodb: {
    uri: mongodbUri,
    // Database options that will be passed directly to mongoose.connect
    // Below are some examples.
    // See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
    // and http://mongoosejs.com/docs/connections.html for more information

    options: {
      // server: {
      //   socketOptions: {
      //     keepAlive: 1
      //   },
      //   poolSize: 5
      // },
      // replset: {
      //   rs_name: 'myReplicaSet',
      //   poolSize: 5
      // },
      db: {
        w: 1,
        numberOfRetries: 2
      }
    }
  },
  agendash: {
    active: true,
    options: {
      db: {
        address: mongodbUri
      }
    }
  }
}
