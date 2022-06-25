;(function () {
  'use strict'

  angular
    .module('app.editor', [])
    .controller('EditorController', EditorController)

  EditorController.$inject = ['$document','$http', '$stateParams', 'EditorFactory', 'logger', '$location','$timeout', 'UserFactory']
  /* @ngInject */
  function EditorController ($document,$http, $stateParams, EditorFactory, logger, $location,$timeout, UserFactory) {
    var vm = this
    vm.title = 'editor'
    vm.editor = {}
    vm.UserFactory = UserFactory
    activate()
    vm.quill;

   var doc = $document[0];

          try {
          console.log(vm.quill.getContents());
        }
        catch(err) {
          console.log("vm.quill.getContents()");   
             }
  

    vm.create = function (validated) {
        console.log("editor create");
console.log(vm.quill.getContents());
      var editor=doc.getElementById("editor-container").children[0];
    //  var editr=editor.getElementById("ql-editor").innerHTML;
  //  var html = editor.root.innerHTML;
    //  console.log(editor.getElementsByTagName('p')[0].innerHTML);


     var text=editor.getElementsByTagName('p')[0].innerHTML;

      // console.log(text);

      if (!validated) {
        logger.warning('Data not valid', vm, 'Create Editor Validation')
        return
      }
      var editor = new EditorFactory(vm.editor)
      editor.user = vm.UserFactory.user
      editor.text=text

      // console.log(editor);

      editor.$save(function (response) {
        vm.editor = response
        //  window.location.href
        $location.url('/editor/list')
      }, function (error) {
        logger.error(error)
      })
    }
    vm.find = function () {
      EditorFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.editor = success
        console.log(vm.quil);
      }, function (error) {
        logger.error(error)
      })
    }
    vm.list = function () {
      EditorFactory.query(function (success) {
        vm.editors = success
      }, function (error) {
        logger.error(error)
      })
    }
    vm.update = function (validated) {
      if (!validated) {
        logger.warning('Data not valid', vm, 'Edit Editor Post Validation')
        return
      }
      EditorFactory.update({
        id: $stateParams.id
      }, vm.editor,
        function (success) {
          $location.url('/editor/view/' + $stateParams.id)
        },
        function (error) {
          logger.error(error)
        })
    }
    vm.delete = function (editorId) {
      // Confirm disabled for testing purposes
      var deleteConfirm = true
      // var deleteConfirm = confirm('Are you sure you want to delete this editor?') // eslint-disable-line
      if (deleteConfirm === true) {
        EditorFactory.remove({
          id: editorId
        },
          function (success) {
            for (var i in vm.editors) {
              if (vm.editors[i]._id === editorId) {
                vm.editors.splice(i, 1)
              }
            }
          },
          function (error) {
            logger.error(error)
          })
      }
    }
    function activate () {
      logger.info('Activated Editor View')
    }

    		           var toolbarOptions = [
               ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
               ['blockquote', 'code-block'],

               [{'header': 1}, {'header': 2}],               // custom button values
               [{'list': 'ordered'}, {'list': 'bullet'}],
               [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
               [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
               [{'direction': 'rtl'}],                         // text direction

               [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
               [{'header': [1, 2, 3, 4, 5, 6, false]}],

               [{'color': []}, {'background': []}],          // dropdown with defaults from theme
               [{'font': []}],
               [{'align': []}],

               ['clean']                                         // remove formatting button
           ];
           
    /*  - Quill gets instantiating from here, have to remove the timeout - starting */
  //    $timeout(function () {
  //      vm.quill = new Quill('#editor-container', {
  //    modules: {
  //      toolbar: toolbarOptions
  //    },
  //    placeholder: 'Compose an epic...',
  //    theme: 'snow'  // or 'bubble'
  //  });
  //     }, 3000)

  //      $timeout(function () {
  //    vm.quill.clipboard.dangerouslyPasteHTML('&nbsp;<b>Suresh World</b><u>Enjoy!</u>');
  //    vm.quill.setText("set text here");
  //     console.log(vm.quill.getText());
  //     }, 3000)
 /*  - Quill gets instantiating from here, have to remove the timeout - ending */

//  vm.saveMe = function ()  {
//       console.log("SaveTextEditor");
//       var editor=doc.getElementById("editor-container").children[0];
//     //  var editr=editor.getElementById("ql-editor").innerHTML;
//   //  var html = editor.root.innerHTML;
//      console.log(editor.getElementsByTagName('p')[0].innerHTML);


//      var text=editor.getElementsByTagName('p')[0].innerHTML;

//       // EditorFactory.saveMe(editor.getElementsByTagName('p')[0].innerHTML);

//        var editor1 = new EditorFactory(editor.getElementsByTagName('p')[0].innerHTML)
//         console.log(editor1);     

//           $http.post('/api/editor/', {
//            text: text        
//          })
//    }
   
  }
})()
