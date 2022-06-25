;(function () {
  'use strict'

  angular
    .module('app.editor')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'editorCreate',
        config: {
          url: '/editor/create',
          templateUrl: 'modules/editor/create.view.html',
          controller: 'EditorController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'editorEdit',
        config: {
          url: '/editor/edit/:id',
          templateUrl: 'modules/editor/edit.view.html',
          controller: 'EditorController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      },
      {
        state: 'editorList',
        config: {
          url: '/editor/list',
          templateUrl: 'modules/editor/list.view.html',
          controller: 'EditorController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'editorView',
        config: {
          url: '/editor/view/:id',
          templateUrl: 'modules/editor/view.view.html',
          controller: 'EditorController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
