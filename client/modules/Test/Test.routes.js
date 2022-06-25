;(function () {
  'use strict'

  angular
    .module('app.Test')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'TestCreate',
        config: {
          url: '/Test/create',
          templateUrl: 'modules/Test/create.view.html',
          controller: 'TestController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'TestEdit',
        config: {
          url: '/Test/edit/:id',
          templateUrl: 'modules/Test/edit.view.html',
          controller: 'TestController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'TestList',
        config: {
          url: '/Test/list',
          templateUrl: 'modules/Test/list.view.html',
          controller: 'TestController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'TestView',
        config: {
          url: '/Test/view/:id',
          templateUrl: 'modules/Test/view.view.html',
          controller: 'TestController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
