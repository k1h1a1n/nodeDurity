describe('Generated Hello Testing', function () {
  beforeEach(module('app.hello'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('helloList')
      states.view = $state.get('helloView')
      states.create = $state.get('helloCreate')
      states.edit = $state.get('helloEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/hello/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/hello/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('HelloController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/hello/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/hello/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('HelloController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/hello/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/hello/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('HelloController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/hello/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/hello/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('HelloController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var HelloController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var helloId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockHelloData = function () {
      return {
        _id: helloId,
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
      HelloController = $controller('HelloController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(HelloController).to.exist
    })

    it('vm.list() should return an array of hellos from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Hello\?noCache=\d+/).respond({
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

      HelloController.list()
      $httpBackend.flush()

      var sameHellos = angular.equals(HelloController.hellos,
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

      expect(sameHellos).to.equal(true)
    })

    it('vm.find() should return a hello from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Hello\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockHelloData()})

      // find() relies on id state param being present
      $stateParams.id = helloId
      HelloController.find()
      $httpBackend.flush()

      var sameHello = angular.equals(HelloController.hello, getMockHelloData())

      expect(sameHello).to.equal(true)
    })

    it('vm.create() should return a hello from POST request and redirect to hello list', function () {
      $httpBackend.whenPOST(/api\/v1\/Hello/)
        .respond({
          data: {
            data: getMockHelloData()
          }
        })

      // Mimic form inputs
      HelloController.hello.title = getMockHelloData().title
      HelloController.hello.content = getMockHelloData().content

      HelloController.create(true)
      $httpBackend.flush()

      var sameHello = angular.equals(HelloController.hello, getMockHelloData())

      expect(sameHello).to.equal(true)
      expect($location.path()).to.equal('/hello/list')
    })

    it('vm.update() should return a hello from PUT request and redirect to hello view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Hello\/[\w\d]+/)
        .respond({
          data: getMockHelloData()
        })

      HelloController.hello = getMockHelloData()

      // Mimic form inputs
      HelloController.hello.title = getMockHelloData().title
      HelloController.hello.content = getMockHelloData().content

      // update() relies on id state param being present
      $stateParams.id = helloId
      HelloController.update(true)
      $httpBackend.flush()

      var sameHello = angular.equals(HelloController.hello, getMockHelloData())

      expect(sameHello).to.equal(true)
      expect($location.path()).to.equal('/hello/view/' + HelloController.hello._id)
    })

    it('vm.delete() should send a DELETE request with a valid hello id and delete the hello from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Hello\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize hello posts as in the hello list view
      HelloController.hellos = [getMockHelloData()]
      expect(HelloController.hellos.length).to.equal(1)

      HelloController.delete(HelloController.hellos[0]._id)
      $httpBackend.flush()

      expect(HelloController.hellos.length).to.equal(0)
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
