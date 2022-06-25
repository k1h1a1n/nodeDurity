;(function () {
  'use strict'

  angular
    .module('app.Contacts')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'ContactsCreate',
        config: {
          url: '/Contacts/create',
          templateUrl: 'modules/Contacts/create.view.html',
          controller: 'ContactsController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'ContactsEdit',
        config: {
          url: '/Contacts/edit/:id',
          templateUrl: 'modules/Contacts/edit.view.html',
          controller: 'ContactsController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'ContactsList',
        config: {
          url: '/Contacts/list',
          templateUrl: 'modules/Contacts/list.view.html',
          controller: 'ContactsController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'ContactsView',
        config: {
          url: '/Contacts/view/:id',
          templateUrl: 'modules/Contacts/view.view.html',
          controller: 'ContactsController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
