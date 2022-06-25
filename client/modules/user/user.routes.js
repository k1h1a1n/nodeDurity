;(function () {
  'use strict'

  angular
    .module('app.user')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'signin',
        config: {
          url: '/signin?redirect',
          templateUrl: 'modules/user/signin.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedout: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
      {
        state: 'signup',
        config: {
          url: '/signup?redirect',
          templateUrl: 'modules/user/signup.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedout: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
      {
        state: 'account',
        config: {
          url: '/account',
          templateUrl: 'modules/user/account.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'forgot',
        config: {
          url: '/forgot',
          templateUrl: 'modules/user/forgot.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
      {
        state: 'reset',
        config: {
          url: '/reset/:token',
          templateUrl: 'modules/user/reset.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
       {
        state: 'activate',
        config: {
          url: '/activate/:token',
          templateUrl: 'modules/user/activate.view.html',
          controller: 'UserController',
          controllerAs: 'vm'        
        }
      },
      {
        state: 'fileupload',
        config: {
          url: '/fileupload',
          templateUrl: 'modules/user/fileupload.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'fileuploadlist',
        config: {
          url: '/fileuploadlist',
          templateUrl: 'modules/user/fileuploadlist.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'editor',
        config: {
          url: '/editor',
          templateUrl: 'modules/user/editor.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'home',
        config: {
          url: '/home',
          templateUrl: 'modules/user/home.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
       {
        state: 'dropdown',
        config: {
          url: '/dropdown',
          templateUrl: 'modules/user/dropdown.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'otpverify',
        config: {
          url: '/otpverify',
          templateUrl: 'modules/user/otpVerify.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      }
    ]
  }
})()
