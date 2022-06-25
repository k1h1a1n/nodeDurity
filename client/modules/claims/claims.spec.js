describe('Generated Claims Testing', function () {
  beforeEach(module('app.claims'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('claimsList')
      states.view = $state.get('claimsView')
      states.create = $state.get('claimsCreate')
      states.edit = $state.get('claimsEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/claims/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/claims/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('ClaimsController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/claims/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/claims/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('ClaimsController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/claims/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/claims/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('ClaimsController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/claims/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/claims/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('ClaimsController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var ClaimsController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var claimsId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockClaimsData = function () {
      return {
        _id: claimsId,
        title: 'Nodejs',
        content: 'Try it out',
        created: timestamp
      }
    }

    beforeEach(inject(function (_$httpBackend_, _$stateParams_, _$location_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_
      $stateParams = _$stateParams_
      $location = _$location_
      $httpBackend.when('GET', /\/api\/authenticate\?noCache=\d+/)
        .respond(200, authResponse)
      $httpBackend.when('GET', /modules\/\w+\/(\d|\w)+\.view\.html\?noCache=\d+/)
        .respond(200, '')
      var $scope = $rootScope.$new()
      ClaimsController = $controller('ClaimsController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(ClaimsController).to.exist
    })

    it('vm.list() should return an array of claimss from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Claims\?noCache=\d+/).respond({
        data: [
          {
            title: 'Nodejs',
            content: 'Try it out',
            created: timestamp
          }, {
            title: 'Angularjs',
            content: 'v2 stable coming soon',
            created: timestamp
          }
        ]
      })

      ClaimsController.list()
      $httpBackend.flush()

      var sameClaimss = angular.equals(ClaimsController.claimss,
        [
          {
            title: 'Nodejs',
            content: 'Try it out',
            created: timestamp
          }, {
            title: 'Angularjs',
            content: 'v2 stable coming soon',
            created: timestamp
          }
        ]
      )

      expect(sameClaimss).to.equal(true)
    })

    it('vm.find() should return a claims from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Claims\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockClaimsData()})

      // find() relies on id state param being present
      $stateParams.id = claimsId
      ClaimsController.find()
      $httpBackend.flush()

      var sameClaims = angular.equals(ClaimsController.claims, getMockClaimsData())

      expect(sameClaims).to.equal(true)
    })

    it('vm.create() should return a claims from POST request and redirect to claims list', function () {
      $httpBackend.whenPOST(/api\/v1\/Claims/)
        .respond({
          data: {
            data: getMockClaimsData()
          }
        })

      // Mimic form inputs
      ClaimsController.claims.title = getMockClaimsData().title
      ClaimsController.claims.content = getMockClaimsData().content

      ClaimsController.create(true)
      $httpBackend.flush()

      var sameClaims = angular.equals(ClaimsController.claims, getMockClaimsData())

      expect(sameClaims).to.equal(true)
      expect($location.path()).to.equal('/claims/list')
    })

    it('vm.update() should return a claims from PUT request and redirect to claims view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Claims\/[\w\d]+/)
        .respond({
          data: getMockClaimsData()
        })

      ClaimsController.claims = getMockClaimsData()

      // Mimic form inputs
      ClaimsController.claims.title = getMockClaimsData().title
      ClaimsController.claims.content = getMockClaimsData().content

      // update() relies on id state param being present
      $stateParams.id = claimsId
      ClaimsController.update(true)
      $httpBackend.flush()

      var sameClaims = angular.equals(ClaimsController.claims, getMockClaimsData())

      expect(sameClaims).to.equal(true)
      expect($location.path()).to.equal('/claims/view/' + ClaimsController.claims._id)
    })

    it('vm.delete() should send a DELETE request with a valid claims id and delete the claims from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Claims\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize claims posts as in the claims list view
      ClaimsController.claimss = [getMockClaimsData()]
      expect(ClaimsController.claimss.length).to.equal(1)

      ClaimsController.delete(ClaimsController.claimss[0]._id)
      $httpBackend.flush()

      expect(ClaimsController.claimss.length).to.equal(0)
    })
  })

  this.timeout(500)

  it('should take less than 500ms', function (done) {
    setTimeout(done, 300)
  })

  it('should take less than 500ms as well', function (done) {
    setTimeout(done, 200)
  })
})
