;(function () {
  'use strict'

  angular
    .module('app.hello')
    .factory('HelloFactory', HelloFactory)

  HelloFactory.$inject = ['$resource']
  /* @ngInject */
  function HelloFactory ($resource) {
    return $resource('/api/hello/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
