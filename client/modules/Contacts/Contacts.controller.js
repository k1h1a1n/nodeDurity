;(function () {
  'use strict'

  angular
    .module('app.Contacts', [])
    .controller('ContactsController', ContactsController)

  ContactsController.$inject = ['$http', '$stateParams', 'ContactsFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function ContactsController ($http, $stateParams, ContactsFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'Contacts'
    vm.Contacts = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {

      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Contacts Validation')
        return
      }

        var Contacts = new ContactsFactory(vm.Contacts)

        console.log(Contacts);

        Contacts.userId = vm.UserFactory.user

      Contacts.$save(function (response) {
        vm.Contacts = response
        //  window.location.href
        $location.url('/Contacts/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      ContactsFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.Contacts = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
        console.log("vmContactss")

      ContactsFactory.query(function (success) {
        vm.Contactss = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Contacts Post Validation')
        return
      }
      ContactsFactory.update({
        id: $stateParams.id
      }, vm.Contacts,
        function (success) {
          $location.url('/Contacts/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (ContactsId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this Contacts?') // eslint-disable-line
      if (deleteConfirm === true) {
        ContactsFactory.remove({
          id: ContactsId
        },
          function (success) {
            for (var i in vm.Contactss) {
              if (vm.Contactss[i]._id === ContactsId) {
                vm.Contactss.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Contacts View')
    }
  }
})()
