;(function () {
  'use strict'

  angular
    .module('app.example', [])
    .controller('ExampleController', ExampleController)

  ExampleController.$inject = ['$http', '$stateParams', 'ExampleFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function ExampleController ($http, $stateParams, ExampleFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'example'
    vm.example = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Example Validation')
        return
      }
      var example = new ExampleFactory(vm.example)
      example.user = vm.UserFactory.user
      example.$save(function (response) {
        vm.example = response
        //  window.location.href
        $location.url('/example/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      ExampleFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.example = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      ExampleFactory.query(function (success) {
        vm.examples = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Example Post Validation')
        return
      }
      ExampleFactory.update({
        id: $stateParams.id
      }, vm.example,
        function (success) {
          $location.url('/example/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (exampleId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this example?') // eslint-disable-line
      if (deleteConfirm === true) {
        ExampleFactory.remove({
          id: exampleId
        },
          function (success) {
            for (var i in vm.examples) {
              if (vm.examples[i]._id === exampleId) {
                vm.examples.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Example View')
    }
  }
})()
