;(function () {
  'use strict'

  angular
    .module('app.example')
    .factory('ExampleFactory', ExampleFactory)

  ExampleFactory.$inject = ['$resource']
  /* @ngInject */
  function ExampleFactory ($resource) {
    return $resource('/api/example/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
