;(function () {
  'use strict'

  angular
    .module('app.Name')
    .factory('NameFactory', NameFactory)

  NameFactory.$inject = ['$resource']
  /* @ngInject */
  function NameFactory ($resource) {
    return $resource('/api/Name/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
