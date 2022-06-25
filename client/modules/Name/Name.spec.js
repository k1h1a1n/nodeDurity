describe('Generated Name Testing', function () {
  beforeEach(module('app.Name'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('NameList')
      states.view = $state.get('NameView')
      states.create = $state.get('NameCreate')
      states.edit = $state.get('NameEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/Name/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/Name/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('NameController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/Name/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/Name/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('NameController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/Name/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/Name/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('NameController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/Name/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/Name/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('NameController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var NameController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var NameId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockNameData = function () {
      return {
        _id: NameId,
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
      NameController = $controller('NameController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(NameController).to.exist
    })

    it('vm.list() should return an array of Names from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Name\?noCache=\d+/).respond({
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

      NameController.list()
      $httpBackend.flush()

      var sameNames = angular.equals(NameController.Names,
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

      expect(sameNames).to.equal(true)
    })

    it('vm.find() should return a Name from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Name\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockNameData()})

      // find() relies on id state param being present
      $stateParams.id = NameId
      NameController.find()
      $httpBackend.flush()

      var sameName = angular.equals(NameController.Name, getMockNameData())

      expect(sameName).to.equal(true)
    })

    it('vm.create() should return a Name from POST request and redirect to Name list', function () {
      $httpBackend.whenPOST(/api\/v1\/Name/)
        .respond({
          data: {
            data: getMockNameData()
          }
        })

      // Mimic form inputs
      NameController.Name.title = getMockNameData().title
      NameController.Name.content = getMockNameData().content

      NameController.create(true)
      $httpBackend.flush()

      var sameName = angular.equals(NameController.Name, getMockNameData())

      expect(sameName).to.equal(true)
      expect($location.path()).to.equal('/Name/list')
    })

    it('vm.update() should return a Name from PUT request and redirect to Name view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Name\/[\w\d]+/)
        .respond({
          data: getMockNameData()
        })

      NameController.Name = getMockNameData()

      // Mimic form inputs
      NameController.Name.title = getMockNameData().title
      NameController.Name.content = getMockNameData().content

      // update() relies on id state param being present
      $stateParams.id = NameId
      NameController.update(true)
      $httpBackend.flush()

      var sameName = angular.equals(NameController.Name, getMockNameData())

      expect(sameName).to.equal(true)
      expect($location.path()).to.equal('/Name/view/' + NameController.Name._id)
    })

    it('vm.delete() should send a DELETE request with a valid Name id and delete the Name from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Name\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize Name posts as in the Name list view
      NameController.Names = [getMockNameData()]
      expect(NameController.Names.length).to.equal(1)

      NameController.delete(NameController.Names[0]._id)
      $httpBackend.flush()

      expect(NameController.Names.length).to.equal(0)
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
