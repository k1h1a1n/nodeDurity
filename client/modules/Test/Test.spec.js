describe('Generated Test Testing', function () {
  beforeEach(module('app.Test'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('TestList')
      states.view = $state.get('TestView')
      states.create = $state.get('TestCreate')
      states.edit = $state.get('TestEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/Test/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/Test/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('TestController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/Test/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/Test/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('TestController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/Test/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/Test/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('TestController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/Test/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/Test/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('TestController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var TestController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var TestId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockTestData = function () {
      return {
        _id: TestId,
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
      TestController = $controller('TestController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(TestController).to.exist
    })

    it('vm.list() should return an array of Tests from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Test\?noCache=\d+/).respond({
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

      TestController.list()
      $httpBackend.flush()

      var sameTests = angular.equals(TestController.Tests,
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

      expect(sameTests).to.equal(true)
    })

    it('vm.find() should return a Test from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Test\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockTestData()})

      // find() relies on id state param being present
      $stateParams.id = TestId
      TestController.find()
      $httpBackend.flush()

      var sameTest = angular.equals(TestController.Test, getMockTestData())

      expect(sameTest).to.equal(true)
    })

    it('vm.create() should return a Test from POST request and redirect to Test list', function () {
      $httpBackend.whenPOST(/api\/v1\/Test/)
        .respond({
          data: {
            data: getMockTestData()
          }
        })

      // Mimic form inputs
      TestController.Test.title = getMockTestData().title
      TestController.Test.content = getMockTestData().content

      TestController.create(true)
      $httpBackend.flush()

      var sameTest = angular.equals(TestController.Test, getMockTestData())

      expect(sameTest).to.equal(true)
      expect($location.path()).to.equal('/Test/list')
    })

    it('vm.update() should return a Test from PUT request and redirect to Test view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Test\/[\w\d]+/)
        .respond({
          data: getMockTestData()
        })

      TestController.Test = getMockTestData()

      // Mimic form inputs
      TestController.Test.title = getMockTestData().title
      TestController.Test.content = getMockTestData().content

      // update() relies on id state param being present
      $stateParams.id = TestId
      TestController.update(true)
      $httpBackend.flush()

      var sameTest = angular.equals(TestController.Test, getMockTestData())

      expect(sameTest).to.equal(true)
      expect($location.path()).to.equal('/Test/view/' + TestController.Test._id)
    })

    it('vm.delete() should send a DELETE request with a valid Test id and delete the Test from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Test\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize Test posts as in the Test list view
      TestController.Tests = [getMockTestData()]
      expect(TestController.Tests.length).to.equal(1)

      TestController.delete(TestController.Tests[0]._id)
      $httpBackend.flush()

      expect(TestController.Tests.length).to.equal(0)
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
