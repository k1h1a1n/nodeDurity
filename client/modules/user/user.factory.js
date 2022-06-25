;(function () {
  'use strict'

  angular
    .module('app.user')
    .factory('UserFactory', UserFactory)

  UserFactory.$inject = ['$rootScope', '$http', '$location', '$stateParams', '$cookies', '$q', '$timeout', 'logger', 'jwtHelper', '$state']

  /* @ngInject */
  function UserFactory ($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout, logger, jwtHelper, $state) {
    var self
    var UserFactory = new UserClass()

    // function getToken (token) {
    //   return jwtHelper.decodeToken(token)
    // }
    function getAuthenticate () {
      var deferred = $q.defer()

      $http.get('/api/user/authenticate').then(function (success) {
        if (success.data) {
          if (!_.isEmpty(success.data.user)) {
            localStorage.setItem('JWT', success.data.token)
          }
          $timeout(deferred.resolve(success.data))
        } else {
          $timeout(deferred.reject({message: 'No Response'}))
        }
      }, function (error) {
        $timeout(deferred.reject(error))
      })
      return deferred.promise
    }

    function UserClass () {
      self = this
      self.name = 'users'
      self.user = {}
      self.token
      self.loggedin = false
      self.isAdmin = false

      getAuthenticate().then(function (data) {
        if (!data && $cookies.get('token') && $cookies.get('redirect')) {
          self.onIdentity.bind(self)({
            token: $cookies.get('token'),
            redirect: $cookies.get('redirect').replace(/^"|"$/g, '')
          })
          $cookies.remove('token')
          $cookies.remove('redirect')
        } else {
          self.onIdentity.bind(self)(data)
        }
      })
    }
    UserClass.prototype.editProfile = function (vm) {
      getAuthenticate().then(function (data) {
        if (data !== '0') {
          vm.editProfile = data
        } else {
          // Not Authenticated
          $state.go('signin')
          // logger.error('Not Authenticated', data, 'Login')
        }
      })
    }
    UserClass.prototype.login = function (vm) {
      console.log(vm);
      $http.post('/api/user/authenticate', {
        email: vm.loginCred.email,
        password: vm.loginCred.password,
        redirect: $stateParams.redirect || '/home'
      }).then(function (success) {
        if (!_.isEmpty(success.data.user)) {
          localStorage.setItem('JWT', success.data.token)
          success.data.user = success.data.user
        }
        self.onIdentity.bind(self)(success.data)
      }, function (error) {
        self.onIdFail.bind(self)(error)
      })
    }
    UserClass.prototype.onIdentity = function (data) {
      if (!data) return ({error: true})

      self.user = data.user
      self.token = data.token
      self.loggedin = data.authenticated
      if (self.user.roles) {
        self.isAdmin = self.user.roles.indexOf('admin') > -1
      }
      if (data.redirect ? data.redirect : false) {
        $location.url(data.redirect)
      }
      $rootScope.$emit('loggedin')
      return ({
        error: false
      })
    }

    UserClass.prototype.onIdFail = function (error) {
      logger.error(error.data.message, error, 'Login/Signup')
      $rootScope.$emit('loginfailed')
      $rootScope.$emit('registerfailed')
      return ({
        error: true
      })
    }

    UserClass.prototype.updateProfile = function (data, response) {
      self.user = data
      logger.success(self.user.profile.name + ' your profile has be saved', self.user, 'Updated Profile')
      $rootScope.$emit('profileUpdated')
    }  
    
    UserClass.prototype.error = function (error) {
     // logger.error(error.data, error, 'User Error')
    }
    UserClass.prototype.update = function (vm) {
      $http.put('/api/user/profile', vm.editProfile)
        .then(self.updateProfile.bind(this, vm.editProfile), self.error.bind(this))
    }

    UserClass.prototype.signup = function (vm) {
      if (vm.loginCred.password === vm.loginCred.confirmPassword) {
        if ($stateParams.redirect)vm.loginCred.redirect = $stateParams.redirect
        $http.post('/api/user/signup', vm.loginCred)
          .then(function (success) {
            if (!_.isEmpty(success.data.user)) {
              localStorage.setItem('JWT', success.data.token)
              success.data.user = success.data.user
            }
             console.log(success.data) //* New Addition
           // success.data.redirect = '/otpverify' //*New Addition 
            success.data.redirect = '/home' 
            self.onIdentity.bind(self)(success.data) //*New Addition

            // success.data.redirect = '/'
            // self.onIdentity.bind(self)(success.data)
          }, function (error) {
            self.onIdFail.bind(self)(error)
          })
      } else {
        // logger.error(' passwords dont match', 'passwords dont match', 'Error')
      }
    }

UserClass.prototype.otp = function (vm) {
         console.log('step 2');
          console.log(vm);
          $state.go("home")
        //  $http.post('/api/sendotp', {
        //    data: vm        
        //  }).then(function (success) {      
        //  }, self.onIdFail.bind(this))
       }
    
    UserClass.prototype.resetTokenCheck = function (vm) {
      $http.get('/api/user/reset/' + vm.resetToken)
        .then(
          function (response) {
            if (response.data.valid) {
              vm.tokenCheck = false
            }
          }, function (response) {
            // logger.error(response.data.message)
            vm.tokenCheck = true
          }
      )
    }

    UserClass.prototype.activateTokenCheck = function (vm) {
      $http.get('/api/user/activate/' + vm.activateToken)
        .then(
          function (response) {
            console.log("activate token check")
            console.log(response)
            if (response.data.valid) {
              vm.tokenCheck = false,
              $rootScope.resetTokenCheckStatus=response,
              console.log($rootScope)
            }
          }, function (response) {
             $rootScope.resetTokenCheckStatus=response,
            // logger.error(response.data.message)
            vm.tokenCheck = true
          }
      )
    }

    UserClass.prototype.reSendVerificationMail = function (vm) {
      $http.post('/api/user/activate/', {
        email: vm      
      }).then(self.onIdentity.bind(this), self.onIdFail.bind(this))
        .then(function (response) {
          if (!response.error) {
           
          }
        })
    }

    UserClass.prototype.resetpassword = function (vm) {
      $http.post('/api/user/reset/' + vm.resetToken, {
        password: vm.resetCred.password,
        confirmPassword: vm.resetCred.confirmPassword
      }).then(self.onIdentity.bind(this), self.onIdFail.bind(this))
        .then(function (response) {
          if (!response.error) {
            logger.success('Password successfully Reset', response)
          }
        })
    }

    UserClass.prototype.forgot = function (vm) {
      $http.post('/api/user/forgot', {
        email: vm.forgot.email
      }).then(function (response) {
        $rootScope.$emit('forgotmailsent', response)
        logger.success(vm.forgot.email, vm.forgot.email, ' Reset Token has been sent to your email')
        vm.clicked = true
        vm.forgot.email = ''
      }, self.onIdFail.bind(this))
    }

    UserClass.prototype.notifymail = function (vm) {
      $http.post('/api/user/notifymail', {
        email: vm.notifymail.email
      }).then(function (response) {
        $rootScope.$emit('notifymailsent', response)
        logger.success(vm.notifymail.email, vm.notifymail.email, 'Notification Mail has been sent')
        vm.clicked = true
        vm.forgot.email = ''
      }, self.onIdFail.bind(this))
    }

    UserClass.prototype.upload = function (vm) {
         console.log('step 2');
          console.log(vm);

         $http.post('/api/user/postUploadFiles', {
           file: vm.name,
         url: 'http://localhost:3000/upload'
        }).then(function (response) {
        //  $scope.fileslist.push({"_id":"598b0b75e1686b10087bcacb","filename":"editcontact factory.png","contentType":"binary/octet-stream","length":2113,"chunkSize":261120,"uploadDate":"2017-08-09T13:17:41.448Z","aliases":null,"metadata":"59885dceaa7fa62adc1c4e52","md5":"136d873ba1503df4c79fd45e2201f4db"});
          $rootScope.$emit('fileupload', response)
         logger.success('File successfully uploaded', response)
         return response
         }, self.onIdFail.bind(this))
       }

    UserClass.prototype.logout = function (vm) {
      $http.get('/api/user/logout').then(function (data) {
        localStorage.removeItem('JWT')
        $rootScope.$emit('logout')
        // ANGULAR WAY
        $state.go('index')
        // ENTERPRISE WAY TO SUPPORT ALL OLDER BROWSERS
        // var indexState = $state.get('index')
        // window.location.href = indexState ? indexState.url : '/'
        self.user = {}
        self.loggedin = false
      })
    }

    UserClass.prototype.checkLoggedin = function () {
      getAuthenticate().then(function (data) {
        if (data.authenticated === false) {
          $state.go('signin', {'redirect': $location.path()})
          // logger.error('please sign in', {user: 'No User'}, 'Unauthenticated')
        }
      })
    }

    UserClass.prototype.checkLoggedOut = function () {
      getAuthenticate().then(function (data) {
        if (data.authenticated !== false) {
          // logger.error(data.user.profile.name + ' You are already signed in', data.user, 'Authenticated Already')
          $state.go('home')
        }
      })
    }

    UserClass.prototype.checkAdmin = function () {
      getAuthenticate().then(function (data) {
        var roles = true
        if (data.user.roles && _.isArray(data.user.roles))roles = data.user.roles.indexOf('admin') === -1
        if (data.authenticated !== true || roles) {
          $state.go('index')
          // logger.error('requires access', {user: 'No User'}, 'Unauthorized')
        }
      })
    }
    UserClass.prototype.resetApiToken = function () {
      $http.get('/api/user/token/reset').then(function (success) {
        self.token = success.data.token
        localStorage.setItem('JWT', self.token)
      }, function (error) {
        // logger.error('Unable to reset API Token', error, 'Server Error')
      })
    }

    UserClass.prototype.saveMe = function (vm,title,id) {
         console.log('step 2');
          console.log(vm+title+id);
         $http.post('/api/editor', {
           text: vm,
           title:title,
           id:id        
         }).then(function (response) {  
            $rootScope.$emit('addnotes', response)
         logger.success('Notes successfully Saved', response)
         }, self.onIdFail.bind(this))
       }

    UserClass.prototype.addContacts = function (vm) {
         console.log('step 2 addContacts');
          console.log(vm);
         $http.post('/api/Contacts', {
           contacts: vm,        
         }).then(function (response) {
           console.log(response)
   $rootScope.$emit('addcontact', response)
         logger.success('Contact successfully added', response)
         }, self.onIdFail.bind(this))
       }

    UserClass.prototype.postmyfiles = function (file,contact,status,type) {
         console.log('step 2 postmyfiles'+status);        
         $http.post('/api/myfiles/check', {
             file: file,
            contact:contact,
            status:status,
            type:type        
         }).then(function (response) {
           console.log(response)
           $rootScope.$emit('fileupload', response)
        logger.success('Trustee Deleted', response)       
         }, self.onIdFail.bind(this))
       }

    UserClass.prototype.postmyNotes = function (file,contact,status,type) {
         console.log('step 2 postmyNotes'+contact);        
         $http.post('/api/editor/addbeneficiary', {
             file: file,
            contact:contact,
            status:status,
            type:type        
         }).then(function (response) {
           console.log(response)
           $rootScope.$emit('fileupload', response)
        logger.success('Notes Updated successfully', response)       
         }, self.onIdFail.bind(this))
    }

      UserClass.prototype.updateContacts = function (vm) {     
          $http.put('/api/Contacts/'+vm._id, {          
           contacts: vm,        
         }).then(function (response) {  
            $rootScope.$emit('updatecontact', response)
         logger.success('Contact successfully updated', response)      
         }, self.onIdFail.bind(this))
       }
       
      UserClass.prototype.deleteContact = function (vm) {
         console.log('step 2 deleteContact');
          console.log(vm);
         $http.delete('/api/Contacts/'+vm, {          
           contacts: vm,        
         }).then(function (response) {  
            $rootScope.$emit('deletecontact', response)
         logger.success('Contact successfully deleted', response)      
         }, self.onIdFail.bind(this))
       }

       UserClass.prototype.deleteFile = function(file) {
          console.log('step 2 deleteFiles');         
         $http.post('/api/myfiles/deletefile', {          
                file:file
         }).then(function (response) {  
            $rootScope.$emit('deletfile', response)
         logger.success('File successfully deleted', response)      
         }, self.onIdFail.bind(this))
       }

      UserClass.prototype.deleteFsFile = function(file) {
          console.log('step 2 deleteFiles');         
         $http.post('/api/user/deletemyfiles', {          
                _id:file
         }).then(function (response) {  
            $rootScope.$emit('deletfile', response)
         logger.success('File successfully deleted', response)      
         }, self.onIdFail.bind(this))
      }

      UserClass.prototype.deleteUser = function(file) {
        console.log('step 2 deleteUser');         
       $http.post('/api/user/delete', {          
              _id:file
       }).then(function (response) {  
          $rootScope.$emit('deletUser', response)
       logger.success('User successfully deleted', response)      
       }, self.onIdFail.bind(this))
    }

       UserClass.prototype.deleteNotes = function(note) {
          console.log('step 2 deleteNotes');         
         $http.post('/api/editor/deletenote', {          
                 _id:note
         }).then(function (response) { 
            $rootScope.$emit('deletnotes', response)
         logger.success('Notes successfully deleted', response)       
         }, self.onIdFail.bind(this))
       }


    return UserFactory
  }
}())
