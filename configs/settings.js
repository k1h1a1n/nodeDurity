require('dotenv').config({silent: true})

var path = require('path')
var _ = require('lodash')
var environment = require('./environment.js').get()
var baseLine = {

  mongodb: {
    uri: 'mongodb://127.0.0.1:27017/prod',
    options: {
    user: 'mongoaccess',
    pass: '8Xz9*!\D8055',
    }
  },

  app: {
    name: 'MeanStackJS'
  },
  cache: {
    maxAge: 0,
    headers: true
  },
  security: {
    cors: {
      active: true,
      options: {
        // origin: function (origin, callback) {
        //   var originIsWhitelisted = ['http://localhost:3000', 'localhost:3000'].indexOf(origin) !== -1
        //   callback(null, originIsWhitelisted)
        // }
      },
      preflight: true
    },
    contentLength: {
      active: true,
      options: {
        max: 5e+7,
        status: 400,
        message: 'Please make a small payload'
      }
    },
    helmet: {
      active: true,
      options: {}
    },
    hpp: {
      active: true,
      options: {}
    },
    contentSecurityPolicy: {
      active: false,
      options: {}
    },
    hpkp: {
      active: false,
      options: {}
    },
    throttler: {
      active: false,
      options: {}
    }
  },
  minify: 'default',
  render: {
    cli: 'lodash', // __ or ejs or lodash.
    seo: 'lodash', // ejs or lodash. default is lodash
    lodash: {
      options: {} // https://lodash.com/docs#template
    },
    ejs: {
      options: {} // https://www.npmjs.com/package/ejs#options
    }
  },
  env: environment,
  // Root path of server
  root: path.join(__dirname, '/../../..'),
  // Server IP
  ip: process.env.IP || '0.0.0.0',
  hostname: process.env.HOST || process.env.HOSTNAME || 'localhost',
  // Enable Swagger.io at localhost:[port]/api/
  swagger: true,
  // Enable the use of babel for ES6
  babel: {
    options: {
      // NOTE you must install the proper package to use here
      presets: [
        'babel-preset-es2015'
      ],
      plugins: [
        'transform-class-properties'
      ]
    },
    folder: 'dist',
    active: false
  },
  // Plato
  plato: {
    title: 'mean stack',
    eslint: {
      lastsemic: true,
      asi: true
    }
  },
  // JWT Object https://github.com/auth0/node-jsonwebtoken
  jwt: {
    // is used to compute a JWT SIGN
    secret: 'MEANSTACKJS',
    options: {
      expiresIn: 86400 // 24 hours.   or  the old way//60 * 120 // 60 seconds * 120  = 2 hours
    }
  },
  // is used to compute a session hash
  sessionSecret: 'MEANSTACKJS',
  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',
  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },
  sessionName: 'session.id',
  // Supports MAX CDN
  maxcdn: {
    companyAlias: process.env.MAXCDN_COMPANY_ALIAS || '',
    consumerKey: process.env.MAXCDN_CONSUMER_KEY || '',
    consumerSecret: process.env.MAXCDN_CONSUMER_SECRET || ''
  },
  // SEO - Default html setup
  googleAnalytics: 'UA-71654331-1',
  html: {
    title: 'Mean Stack JS Demo',
    keywords: 'MEAN, MEANSTACKJS, mongodb, expressjs, angularjs,nodejs, javascript',
    description: 'Mean Stack JS was built for ease of use with javascript at its core. MeanStackJS is a full stack javascript framework that will give you the power to develop web applications',
    ogUrl: 'https://meanstackjs.herokuapp.com/',
    ogType: 'website',
    ogTitle: 'Mean Stack JS Demo',
    ogDescription: 'Mean Stack JS was built for ease of use with javascript at its core. MeanStackJS is a full stack javascript framework that will give you the power to develop web applications',
    ogImage: 'http://meanstackjs.com/images/logo/header.png',
    fbAppId: '1610630462580116',
    twitterCreator: '@greenpioneerdev',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Mean Stack JS Demo',
    twitterDescription: 'Mean Stack JS was built for ease of use with javascript at its core. MeanStackJS is a full stack javascript framework that will give you the power to develop web applications',
    twitterUrl: 'https://meanstackjs.herokuapp.com/',
    twitterImage: 'http://meanstackjs.com/images/logo/header.png',
    twitterSite: '@meanstackjs',
    canonical: 'https://meanstackjs.herokuapp.com/',
    author: 'Durity Inc'
  },
  seo: require('./seo.js'),
  // AGGREGATION
  // bower_components -  Needs to be manually added below
  // modules - aggregated automatically
  // images - manually called in files
  // styles - manually called  & automatically compiles the global style scss in COMPILED Folder
  // uploads - Automatic uploads to be manually called in the files
  // USE EXTERNAL FILES - 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
  // OR USE INTERNAL FILES - '/bower_components/jquery/dist/jquery.js'
  assets: {
    js: [
     /* '/bower_components/ngBrowserInfo/dist/ngBrowserInfo.js',
      '/bower_components/angular-jwt/dist/angular-jwt.js',
      '/bower_components/socket.io-client/socket.io.js',
      '/bower_components/ng-file-upload/ng-file-upload-all.js',
      '/bower_components/angular-mocks/angular-mocks.js',
      '/bower_components/angular-cookies/angular-cookies.js',
      '/bower_components/angular-sanitize/angular-sanitize.js',
      '/bower_components/angular-animate/angular-animate.js',
      '/bower_components/angular-resource/angular-resource.js',
      '/bower_components/angular-ui-router/release/angular-ui-router.js',
      '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      '/bower_components/angular-moment/angular-moment.js',
      '/bower_components/moment/moment.js',
      '/bower_components/lodash/lodash.js',
      '/bower_components/toastr/toastr.js',
      '/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      '/bower_components/angular/angular.js',
      '/bower_components/jquery/dist/jquery.js' */
    ],
    css: [
     // '/node_modules/bootstrap/scss/bootstrap.scss',
      '/styles/compiled/global.style.css'
     // '/bower_components/toastr/toastr.css'
    // '/bower_components/font-awesome/css/font-awesome.min.css'
    ]
  },
  bodyparser: {
    json: {limit: '50mb'},
    urlencoded: {limit: '50mb', extended: true}
  },
  expresValidator: {
    customValidators: {
      isArray: function (value) {
        // req.assert('param', 'Invalid Param').isArray()
        return _.isObject(value)
      },
      isObject: function (value) {
        // req.assert('param', 'Invalid Param').isObject()
        return _.isObject(value)
      },
      isString: function (value) {
        // req.assert('param', 'Invalid Param').isString()
        return _.isString(value)
      },
      isRegExp: function (value) {
        // req.assert('param', 'Invalid Param').isRegExp()
        return _.isRegExp(value)
      },
      isEmpty: function (value) {
        // req.assert('param', 'Invalid Param').isEmpty()
        return _.isEmpty(value)
      },
      gte: function (param, num) {
        // req.assert('param', 'Invalid Param').gte(5)
        return _.gte(param, num)
      },
      lte: function (param, num) {
        // req.assert('param', 'Invalid Param').lte(5)
        return _.lte(param, num)
      },
      gt: function (param, num) {
        // req.assert('param', 'Invalid Param').gt(5)
        return _.gt(param, num)
      },
      lt: function (param, num) {
        // req.assert('param', 'Invalid Param').lt(5)
        return _.lt(param, num)
      }
    },
    customSanitizers: {
      toArray: function (value) {
        // req.sanitize('postparam').toArray()
        return _.toArray(value)
      },
      toFinite: function (value) {
        // req.sanitize('postparam').toFinite()
        return _.toFinite(value)
      },
      toLength: function (value) {
        // req.sanitize('postparam').toLength()
        return _.toLength(value)
      },
      toPlainObject: function (value) {
        // req.sanitize('postparam').toPlainObject()
        return _.toPlainObject(value)
      },
      toString: function (value) {
        // req.sanitize('postparam').toString()
        return _.toString(value)
      }
    },
    errorFormatter: function (param, message, value) {
      var namespace = param.split('.')
      var root = namespace.shift()
      var formParam = root

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
      }
      return {
        param: formParam,
        message: message,
        value: value
      }
    }
  },
  buildreq: {
    console: true,
    response: {
      method: 'get',
      data: {},
      user: {},
      count: 0,
      hostname: '',
      type: '',
      actions: {
        prev: false,
        next: false,
        reload: false
      },
      delete: ['error']
    },
    query: {
      sort: '',
      limit: 20,
      select: '',
      filter: {},
      populateId: 'user',
      populateItems: '',
      lean: false,
      skip: 0,
      where: '',
      gt: 1,
      lt: 0,
      in: [],
      equal: '',
      errorMessage: 'Unknown Value'
    },
    routing: {
      schema: true,
      url: '/api/v1/',
      build: true
    }
  },
  email: {
    templates: {
      welcome: {
        subject: 'Welcome to Durity',
        text: function (username, link, token) {
          return 'Hi ' + username + ',\n\n<br>' +
          'Thanks for signing up for Durity.<br>' +

          'Click this  link to activate your account in durity '+
        'https://mydurity.com/user/activate/'+token+'\n\n'+
          '— Durity'
        }
      },
      reset: {
        subject: 'Reset your password on Durity ',
        text: function (email) {
          return 'Hello,<br>' +
          'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
        }
      },
      forgot: {
        subject: 'Welcome to Durity',
        text: function (host, token) {
          return 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.<br>' +
          'Please click on the following link, or paste this into your browser to complete the process:<br>' +
          'https://mydurity.com' +'/reset/' + token + '<br>' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
      },
      notifymail: {
        subject: 'Welcome to Durity',
        text: function (file, beneficiaryDetail) {
          return 'You are receiving this email because you have been added as a Beneficiary for ' + file + ' on Durity.<br>' +
          'Please click on the following link, or paste this into your browser to complete the process:<br>' +
          'http://' + file + beneficiaryDetail + '<br>' +
          'If you did not request this, please ignore this email.<br>'
        },
      claimEmail: {
          subject: 'Request for Claim consensus in durity',
          text: function (nominatorName, nomineeName) {
            return 'You are receiving this email because you have been added as a Beneficiary for ' + file + ' on Durity.<br>' +
            'Please click on the following link, or paste this into your browser to complete the process:<br>' +
            'http://' + file + beneficiaryDetail + '<br>' +
            'If you did not request this, please ignore this email.<br>'
          }
        }},
        informFileUploadToBeneficiary: {
          subject: 'I have a confidential document for you with Durity',
          text: function (userName, durityId) {
            return 'Dear One,<br>  This is to inform you that  I’m storing my confidential information in Durity for you.<br>'+
            'In case of an emergency, please contact mydurity.com to get the documents.<br>'+
            'I also recommend that you create your own Durity account and safeguard your loved one\'s future.<br>'+
            'Kindly store this email safely.<br>'+
            'Regards,<br>'+
            userName+'<br>'+
            'Durity ID is :'+ durityId
          }
        },
        encryptAndUpload: {
          subject: 'I have an encrypted confidential document for you with Durity',
          text: function (userName, durityId) {
            return 'Dear One,<br>  This is to inform you that  I’m storing my confidential information in Durity for you. It is an AES 256 Bit encrypted file and I will share you the password in a separate message to decrypt it.<br>'+
            'In case of an emergency, please contact mydurity.com to get the documents.<br>'+
            'I also recommend that you create your own Durity account and safeguard your loved one\'s future.<br>'+
            'Kindly store this email safely. Durity will not be storing my password in any form. You won\'t be able to recover my file if the password is lost and Durity won\'t be able to help you recover it if lost.<br>'+
            'Regards,<br>'+
            userName+'<br>'+
            'Durity ID is :'+ durityId
          }
        },
        deleteDocument: {
          subject: 'Document deletion alert with Durity',
          text: function (userName, durityId) {
            return 'Dear One,<br>  we regret to inform you that '+ userName+ '( '+durityId+' ) has deleted the documents that you have been a beneficiary till now for further details please contact the user<br>'+
            'please check out the durity app a platform to secure your future by storing information and convey it to your loved ones.<br>'+
            'With Regards,<br>'+
            'Durity Team.'
          }
        },
        revokeAcces: {
          subject: 'Access revoking alert with Durity',
          text: function (userName, durityId) {
            return 'Dear One,<br> we regret to inform you that '+ userName+ '( '+durityId+' ) has revoked your access to documents that you have been a beneficiary till now for further details please contact the user<br>'+
            'please check out the durity app a platform to secure your future by storing information and convey it to your loved ones.<br>'+
            'With Regards,<br>'+
            'Durity Team.'
          }
        }
    },
    from: 'noreply@durity.life',
    error: 'noreply@durity.life',
    connect: {
      host: 'mail.durity.life',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user:  'noreply@durity.life', // generated ethereal user
            pass:  'Durity123' // generated ethereal password
        }, tls: {
          rejectUnauthorized:false
      }
    }
  },
  validationServerIP: 'http://54.69.3.67:8058/otpServices/'
}
if (environment === 'test') {
  baseLine = _.assign(baseLine, require('./environments/test.js'))
} else if (environment === 'production') {
  baseLine = _.assign(baseLine, require('./environments/production.js'))
} else if (environment === 'nightwatch') {
  baseLine = _.assign(baseLine, require('./environments/nightwatch.js'))
} else {
  baseLine = _.assign(baseLine, require('./environments/development.js'))
}

exports.get = function (env) {
  return baseLine
}
exports.set = function (identifer, value) {
  baseLine[identifer] = value
  return baseLine
}
