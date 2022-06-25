;(function () {
  'use strict'

  angular
    .module('app.claims')
    .factory('ClaimsFactory', ClaimsFactory)

  ClaimsFactory.$inject = ['$resource']
  /* @ngInject */
  function ClaimsFactory ($resource) {
    return $resource('/api/claims/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
