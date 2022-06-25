var editor = require('./editor.controller.js')

module.exports = function (app, auth, mail, settings, models, logger) {
  // GET
  app.get('/api/editor/', editor.getEditor)
  app.get('/api/editor/:editorId', editor.getEditorById)
  // POST
  app.post('/api/editor', editor.postEditor)
  app.post('/api/editor/addbeneficiary', editor.check)
  // PUT
  app.put('/api/editor/:editorId', editor.putEditor)
  // DELETE
 // app.delete('/api/editor/:editorId', editor.deleteEditor)
    app.post('/api/editor/deletenote',editor.deleteEditor) 
 // PARAM
  app.param('editorId', editor.paramEditor)
}
