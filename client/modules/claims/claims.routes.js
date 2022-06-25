;(function () {
  'use strict'

  angular
    .module('app.claims')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'claimsCreate',
        config: {
          url: '/claims/create',
          templateUrl: 'modules/claims/create.view.html',
          controller: 'ClaimsController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'claimsEdit',
        config: {
          url: '/claims/edit/:id',
          templateUrl: 'modules/claims/edit.view.html',
          controller: 'ClaimsController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'claimsList',
        config: {
          url: '/claims/list',
          templateUrl: 'modules/claims/list.view.html',
          controller: 'ClaimsController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'claimsView',
        config: {
          url: '/claims/view/:id',
          templateUrl: 'modules/claims/view.view.html',
          controller: 'ClaimsController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
