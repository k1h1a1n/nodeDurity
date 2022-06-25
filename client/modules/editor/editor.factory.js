;(function () {
  'use strict'

  angular
    .module('app.editor')
    .factory('EditorFactory', EditorFactory)

  EditorFactory.$inject = ['$resource']
  /* @ngInject */
  function EditorFactory ($resource) {
    return $resource('/api/editor/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
