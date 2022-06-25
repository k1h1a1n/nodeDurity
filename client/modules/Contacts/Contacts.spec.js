describe('Generated Contacts Testing', function () {
  beforeEach(module('app.Contacts'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('ContactsList')
      states.view = $state.get('ContactsView')
      states.create = $state.get('ContactsCreate')
      states.edit = $state.get('ContactsEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/Contacts/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/Contacts/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('ContactsController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/Contacts/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/Contacts/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('ContactsController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/Contacts/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/Contacts/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('ContactsController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/Contacts/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/Contacts/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('ContactsController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var ContactsController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var ContactsId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockContactsData = function () {
      return {
        _id: ContactsId,
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
      ContactsController = $controller('ContactsController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(ContactsController).to.exist
    })

    it('vm.list() should return an array of Contactss from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Contacts\?noCache=\d+/).respond({
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

      ContactsController.list()
      $httpBackend.flush()

      var sameContactss = angular.equals(ContactsController.Contactss,
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

      expect(sameContactss).to.equal(true)
    })

    it('vm.find() should return a Contacts from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Contacts\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockContactsData()})

      // find() relies on id state param being present
      $stateParams.id = ContactsId
      ContactsController.find()
      $httpBackend.flush()

      var sameContacts = angular.equals(ContactsController.Contacts, getMockContactsData())

      expect(sameContacts).to.equal(true)
    })

    it('vm.create() should return a Contacts from POST request and redirect to Contacts list', function () {
      $httpBackend.whenPOST(/api\/v1\/Contacts/)
        .respond({
          data: {
            data: getMockContactsData()
          }
        })

      // Mimic form inputs
      ContactsController.Contacts.title = getMockContactsData().title
      ContactsController.Contacts.content = getMockContactsData().content

      ContactsController.create(true)
      $httpBackend.flush()

      var sameContacts = angular.equals(ContactsController.Contacts, getMockContactsData())

      expect(sameContacts).to.equal(true)
      expect($location.path()).to.equal('/Contacts/list')
    })

    it('vm.update() should return a Contacts from PUT request and redirect to Contacts view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Contacts\/[\w\d]+/)
        .respond({
          data: getMockContactsData()
        })

      ContactsController.Contacts = getMockContactsData()

      // Mimic form inputs
      ContactsController.Contacts.title = getMockContactsData().title
      ContactsController.Contacts.content = getMockContactsData().content

      // update() relies on id state param being present
      $stateParams.id = ContactsId
      ContactsController.update(true)
      $httpBackend.flush()

      var sameContacts = angular.equals(ContactsController.Contacts, getMockContactsData())

      expect(sameContacts).to.equal(true)
      expect($location.path()).to.equal('/Contacts/view/' + ContactsController.Contacts._id)
    })

    it('vm.delete() should send a DELETE request with a valid Contacts id and delete the Contacts from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Contacts\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize Contacts posts as in the Contacts list view
      ContactsController.Contactss = [getMockContactsData()]
      expect(ContactsController.Contactss.length).to.equal(1)

      ContactsController.delete(ContactsController.Contactss[0]._id)
      $httpBackend.flush()

      expect(ContactsController.Contactss.length).to.equal(0)
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
