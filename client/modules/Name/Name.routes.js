;(function () {
  'use strict'

  angular
    .module('app.Name')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'NameCreate',
        config: {
          url: '/Name/create',
          templateUrl: 'modules/Name/create.view.html',
          controller: 'NameController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'NameEdit',
        config: {
          url: '/Name/edit/:id',
          templateUrl: 'modules/Name/edit.view.html',
          controller: 'NameController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'NameList',
        config: {
          url: '/Name/list',
          templateUrl: 'modules/Name/list.view.html',
          controller: 'NameController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'NameView',
        config: {
          url: '/Name/view/:id',
          templateUrl: 'modules/Name/view.view.html',
          controller: 'NameController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
