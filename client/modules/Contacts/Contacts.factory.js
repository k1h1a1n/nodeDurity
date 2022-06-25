;(function () {
  'use strict'

  angular
    .module('app.Contacts')
    .factory('ContactsFactory', ContactsFactory)

  ContactsFactory.$inject = ['$resource']
  /* @ngInject */
  function ContactsFactory ($resource) {
    return $resource('/api/Contacts/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
