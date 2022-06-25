;(function () {
  'use strict'

  angular
    .module('app.Test')
    .factory('TestFactory', TestFactory)

  TestFactory.$inject = ['$resource']
  /* @ngInject */
  function TestFactory ($resource) {
    return $resource('/api/Test/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
