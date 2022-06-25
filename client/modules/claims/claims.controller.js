;(function () {
  'use strict'

  angular
    .module('app.claims', [])
    .controller('ClaimsController', ClaimsController)

  ClaimsController.$inject = ['$http', '$stateParams', 'ClaimsFactory', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function ClaimsController ($http, $stateParams, ClaimsFactory, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'claims'
    vm.claims = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Claims Validation')
        return
      }
      var claims = new ClaimsFactory(vm.claims)
      claims.user = vm.UserFactory.user
      claims.$save(function (response) {
        vm.claims = response
        //  window.location.href
        $location.url('/claims/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      ClaimsFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.claims = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      ClaimsFactory.query(function (success) {
        vm.claimss = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Claims Post Validation')
        return
      }
      ClaimsFactory.update({
        id: $stateParams.id
      }, vm.claims,
        function (success) {
          $location.url('/claims/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (claimsId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this claims?') // eslint-disable-line
      if (deleteConfirm === true) {
        ClaimsFactory.remove({
          id: claimsId
        },
          function (success) {
            for (var i in vm.claimss) {
              if (vm.claimss[i]._id === claimsId) {
                vm.claimss.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Claims View')
    }
  }
})()
