describe('Generated Example Testing', function () {
  beforeEach(module('app.example'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('exampleList')
      states.view = $state.get('exampleView')
      states.create = $state.get('exampleCreate')
      states.edit = $state.get('exampleEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/example/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/example/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('ExampleController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/example/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/example/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('ExampleController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/example/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/example/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('ExampleController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/example/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/example/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('ExampleController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var ExampleController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var exampleId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockExampleData = function () {
      return {
        _id: exampleId,
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
      ExampleController = $controller('ExampleController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(ExampleController).to.exist
    })

    it('vm.list() should return an array of examples from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Example\?noCache=\d+/).respond({
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

      ExampleController.list()
      $httpBackend.flush()

      var sameExamples = angular.equals(ExampleController.examples,
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

      expect(sameExamples).to.equal(true)
    })

    it('vm.find() should return a example from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Example\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockExampleData()})

      // find() relies on id state param being present
      $stateParams.id = exampleId
      ExampleController.find()
      $httpBackend.flush()

      var sameExample = angular.equals(ExampleController.example, getMockExampleData())

      expect(sameExample).to.equal(true)
    })

    it('vm.create() should return a example from POST request and redirect to example list', function () {
      $httpBackend.whenPOST(/api\/v1\/Example/)
        .respond({
          data: {
            data: getMockExampleData()
          }
        })

      // Mimic form inputs
      ExampleController.example.title = getMockExampleData().title
      ExampleController.example.content = getMockExampleData().content

      ExampleController.create(true)
      $httpBackend.flush()

      var sameExample = angular.equals(ExampleController.example, getMockExampleData())

      expect(sameExample).to.equal(true)
      expect($location.path()).to.equal('/example/list')
    })

    it('vm.update() should return a example from PUT request and redirect to example view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Example\/[\w\d]+/)
        .respond({
          data: getMockExampleData()
        })

      ExampleController.example = getMockExampleData()

      // Mimic form inputs
      ExampleController.example.title = getMockExampleData().title
      ExampleController.example.content = getMockExampleData().content

      // update() relies on id state param being present
      $stateParams.id = exampleId
      ExampleController.update(true)
      $httpBackend.flush()

      var sameExample = angular.equals(ExampleController.example, getMockExampleData())

      expect(sameExample).to.equal(true)
      expect($location.path()).to.equal('/example/view/' + ExampleController.example._id)
    })

    it('vm.delete() should send a DELETE request with a valid example id and delete the example from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Example\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize example posts as in the example list view
      ExampleController.examples = [getMockExampleData()]
      expect(ExampleController.examples.length).to.equal(1)

      ExampleController.delete(ExampleController.examples[0]._id)
      $httpBackend.flush()

      expect(ExampleController.examples.length).to.equal(0)
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
