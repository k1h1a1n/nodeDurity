;(function () {
  'use strict'

  angular
    .module('app.Test', [])
    .controller('TestController', TestController)

  TestController.$inject = ['$http', '$stateParams', 'TestFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function TestController ($http, $stateParams, TestFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'Test'
    vm.Test = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Test Validation')
        return
      }
      var Test = new TestFactory(vm.Test)
      Test.user = vm.UserFactory.user
      Test.$save(function (response) {
        vm.Test = response
        //  window.location.href
        $location.url('/Test/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      TestFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.Test = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      TestFactory.query(function (success) {
        vm.Tests = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Test Post Validation')
        return
      }
      TestFactory.update({
        id: $stateParams.id
      }, vm.Test,
        function (success) {
          $location.url('/Test/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (TestId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this Test?') // eslint-disable-line
      if (deleteConfirm === true) {
        TestFactory.remove({
          id: TestId
        },
          function (success) {
            for (var i in vm.Tests) {
              if (vm.Tests[i]._id === TestId) {
                vm.Tests.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Test View')
    }
  }
})()
