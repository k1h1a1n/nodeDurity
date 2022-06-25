;(function () {
  'use strict'

  angular
    .module('app.hello')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'helloCreate',
        config: {
          url: '/hello/create',
          templateUrl: 'modules/hello/create.view.html',
          controller: 'HelloController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'helloEdit',
        config: {
          url: '/hello/edit/:id',
          templateUrl: 'modules/hello/edit.view.html',
          controller: 'HelloController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'helloList',
        config: {
          url: '/hello/list',
          templateUrl: 'modules/hello/list.view.html',
          controller: 'HelloController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'helloView',
        config: {
          url: '/hello/view/:id',
          templateUrl: 'modules/hello/view.view.html',
          controller: 'HelloController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
