;(function () {
  'use strict'

  angular
    .module('app.Name', [])
    .controller('NameController', NameController)

  NameController.$inject = ['$http', '$stateParams', 'NameFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function NameController ($http, $stateParams, NameFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'Name'
    vm.Name = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Name Validation')
        return
      }
      var Name = new NameFactory(vm.Name)
      Name.user = vm.UserFactory.user
      Name.$save(function (response) {
        vm.Name = response
        //  window.location.href
        $location.url('/Name/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      NameFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.Name = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      NameFactory.query(function (success) {
        vm.Names = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Name Post Validation')
        return
      }
      NameFactory.update({
        id: $stateParams.id
      }, vm.Name,
        function (success) {
          $location.url('/Name/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (NameId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this Name?') // eslint-disable-line
      if (deleteConfirm === true) {
        NameFactory.remove({
          id: NameId
        },
          function (success) {
            for (var i in vm.Names) {
              if (vm.Names[i]._id === NameId) {
                vm.Names.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Name View')
    }
  }
})()
