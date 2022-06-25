;(function () {
  'use strict'

  angular
    .module('app.hello', [])
    .controller('HelloController', HelloController)

  HelloController.$inject = ['$http', '$stateParams', 'HelloFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function HelloController ($http, $stateParams, HelloFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'hello'
    vm.hello = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Hello Validation')
        return
      }
      var hello = new HelloFactory(vm.hello)
      hello.user = vm.UserFactory.user
      hello.$save(function (response) {
        vm.hello = response
        //  window.location.href
        $location.url('/hello/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      HelloFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.hello = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      HelloFactory.query(function (success) {
        vm.hellos = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Hello Post Validation')
        return
      }
      HelloFactory.update({
        id: $stateParams.id
      }, vm.hello,
        function (success) {
          $location.url('/hello/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (helloId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this hello?') // eslint-disable-line
      if (deleteConfirm === true) {
        HelloFactory.remove({
          id: helloId
        },
          function (success) {
            for (var i in vm.hellos) {
              if (vm.hellos[i]._id === helloId) {
                vm.hellos.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Hello View')
    }
  }
})()
