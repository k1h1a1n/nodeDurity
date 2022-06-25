;(function () {
  'use strict'

  angular
    .module('app.example')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'exampleCreate',
        config: {
          url: '/example/create',
          templateUrl: 'modules/example/create.view.html',
          controller: 'ExampleController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'exampleEdit',
        config: {
          url: '/example/edit/:id',
          templateUrl: 'modules/example/edit.view.html',
          controller: 'ExampleController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'exampleList',
        config: {
          url: '/example/list',
          templateUrl: 'modules/example/list.view.html',
          controller: 'ExampleController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'exampleView',
        config: {
          url: '/example/view/:id',
          templateUrl: 'modules/example/view.view.html',
          controller: 'ExampleController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
