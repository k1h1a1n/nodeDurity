describe('Generated Editor Testing', function () {
  beforeEach(module('app.editor'))
  beforeEach(module('app.core'))
  beforeEach(module('app.user'))

  describe('routes', function () {
    var states = {}
    beforeEach(inject(function ($state) {
      states.list = $state.get('editorList')
      states.view = $state.get('editorView')
      states.create = $state.get('editorCreate')
      states.edit = $state.get('editorEdit')
    }))

    describe('list', function () {
      it('should have the correct url', function () {
        expect(states.list.url).to.equal('/editor/list')
      })

      it('should have the correct templateUrl', function () {
        expect(states.list.templateUrl).to.equal('modules/editor/list.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.list.controller).to.equal('EditorController')
      })
    })

    describe('view', function () {
      it('should have the correct url', function () {
        expect(states.view.url).to.equal('/editor/view/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.view.templateUrl).to.equal('modules/editor/view.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.view.controller).to.equal('EditorController')
      })
    })

    describe('create', function () {
      it('should have the correct url', function () {
        expect(states.create.url).to.equal('/editor/create')
      })

      it('should have the correct templateUrl', function () {
        expect(states.create.templateUrl).to.equal('modules/editor/create.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.create.controller).to.equal('EditorController')
      })
    })

    describe('edit', function () {
      it('should have the correct url', function () {
        expect(states.edit.url).to.equal('/editor/edit/:id')
      })

      it('should have the correct templateUrl', function () {
        expect(states.edit.templateUrl).to.equal('modules/editor/edit.view.html')
      })

      it('should have the correct controller', function () {
        expect(states.edit.controller).to.equal('EditorController')
      })
    })
  })

  describe('controller', function () {
    var $httpBackend
    var $stateParams
    var $location
    var EditorController
    var authResponse = {
      user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjp7ImdlbmRlciI6Ik1hbGUiLCJsb2NhdGlvbiI6IkludGVybmF0aW9uYWwiLCJ3ZWJzaXRlIjoiZ29vZ2xlLmNvbSIsInBpY3R1cmUiOiIiLCJuYW1lIjoiVGVzdCBVc2VyIn0sInJvbGVzIjpbXSwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZDViYjRmZmZmYTZhMzI0MjhjN2UzMTBjMzQxYjRmN2I_cz0yMDAmZD1yZXRybyIsImVtYWlsIjoidGVzdEB1c2VyLmNvbSIsIl9pZCI6IjU3MTdhMmQ1MGI1ZTQ0YWE1ZTU0NjQ4YiIsImlhdCI6MTQ2MTE2NzQ5NSwiZXhwIjoxNDYxMTc0Njk1fQ.tsAiRGB-lUhnD70XXtliNsTzQj3gKLA0a28yTJWoo8c'
    }
    var editorId = '571a6803389f702a5c16dfa1'
    var timestamp = new Date()
    var getMockEditorData = function () {
      return {
        _id: editorId,
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
      EditorController = $controller('EditorController', {$scope: $scope})
    }))

    it('should exist', function () {
      expect(EditorController).to.exist
    })

    it('vm.list() should return an array of editors from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Editor\?noCache=\d+/).respond({
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

      EditorController.list()
      $httpBackend.flush()

      var sameEditors = angular.equals(EditorController.editors,
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

      expect(sameEditors).to.equal(true)
    })

    it('vm.find() should return a editor from GET request and store it in vm', function () {
      $httpBackend.whenGET(/\/api\/v1\/Editor\/[\w\d]+\?noCache=\d+/)
        .respond({data: getMockEditorData()})

      // find() relies on id state param being present
      $stateParams.id = editorId
      EditorController.find()
      $httpBackend.flush()

      var sameEditor = angular.equals(EditorController.editor, getMockEditorData())

      expect(sameEditor).to.equal(true)
    })

    it('vm.create() should return a editor from POST request and redirect to editor list', function () {
      $httpBackend.whenPOST(/api\/v1\/Editor/)
        .respond({
          data: {
            data: getMockEditorData()
          }
        })

      // Mimic form inputs
      EditorController.editor.title = getMockEditorData().title
      EditorController.editor.content = getMockEditorData().content

      EditorController.create(true)
      $httpBackend.flush()

      var sameEditor = angular.equals(EditorController.editor, getMockEditorData())

      expect(sameEditor).to.equal(true)
      expect($location.path()).to.equal('/editor/list')
    })

    it('vm.update() should return a editor from PUT request and redirect to editor view', function () {
      $httpBackend.whenPUT(/\/api\/v1\/Editor\/[\w\d]+/)
        .respond({
          data: getMockEditorData()
        })

      EditorController.editor = getMockEditorData()

      // Mimic form inputs
      EditorController.editor.title = getMockEditorData().title
      EditorController.editor.content = getMockEditorData().content

      // update() relies on id state param being present
      $stateParams.id = editorId
      EditorController.update(true)
      $httpBackend.flush()

      var sameEditor = angular.equals(EditorController.editor, getMockEditorData())

      expect(sameEditor).to.equal(true)
      expect($location.path()).to.equal('/editor/view/' + EditorController.editor._id)
    })

    it('vm.delete() should send a DELETE request with a valid editor id and delete the editor from the view model', function () {
      $httpBackend.whenDELETE(/api\/v1\/Editor\/([0-9a-fA-F]{24})$/)
        .respond(204)

      // Initialize editor posts as in the editor list view
      EditorController.editors = [getMockEditorData()]
      expect(EditorController.editors.length).to.equal(1)

      EditorController.delete(EditorController.editors[0]._id)
      $httpBackend.flush()

      expect(EditorController.editors.length).to.equal(0)
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
