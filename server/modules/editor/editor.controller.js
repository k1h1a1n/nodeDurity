exports.getEditor = getEditor
exports.deleteEditor = deleteEditor
exports.postEditor = postEditor
exports.putEditor = putEditor
exports.getEditorById = getEditorById
exports.paramEditor = paramEditor
exports.check = check

var mongooseValidator = require('mongoose-validators')    
var crypto = require('crypto')
var auto = require('run-auto')
var mongoose = require('mongoose')
var editors = mongoose.model('editor')
var MongoClient=require('mongodb').MongoClient;
var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'my secret';

var _ = require('lodash')
//var logger = require('./../../logger.js').logger
var {ObjectId} = require('mongodb'); // or ObjectID // or var ObjectId = require('mongodb').ObjectId if node version < 6

var safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
// this other way is probably more efficient:
const objectIdRe = /^[0-9a-fA-F]{24}$/;
var safeObjectId = s => objectIdRe.test(s) ? new ObjectId(Buffer.from(s, 'hex')) : null;

function getEditor (req, res, next) {
  auto({
    editors: function (cb) {
      editors
        .find({userId : req.user._id, status: "true"})
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    return res.status(200).send(results.editors)    
  })  
}

function deleteEditor (req, res, next) {
  // req.editor.remove(function () {
  //   res.status(204).send()
  // })

  console.log(req);
  editors.findOneAndUpdate({ _id : safeObjectId(req.body._id)}, 
{$set:{status:false}}, {new: true}, function(err, doc){
if(err){
console.log("Something wrong when updating data!"); 
}

console.log("deleted successfully"+doc);
res.status(204).send()

});

}
function encrypt(text){
  
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
function postEditor (req, res, next) {
  // req.assert('name', 'The name cannot be blank').notEmpty()
console.log("test");
console.log("req.body"+req);
//console.log(req);
if(req.body.title==undefined  || req.body.text==undefined || req.user._id== undefined){
  console.log("NULL VALUE OBTAINED")
  return res.send("UNDEFINED FROM CLIENT REQUEST")
}
  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
//encrypt(text)

   var hw = encrypt(req.body.text)

   console.log(req.body);

 var text = new editors({
     userId: req.user._id,
     data: hw,
     title:req.body.title,
     status: true
 });
 
 text.save(function(error) {
     console.log("Your Data has been saved!");
     res.send(text)
 if (error) {
     console.error(error);
  }
 });
 console.log(encrypt(hw));
}

function check(req,res){
  console.log("check called");
  console.log(req.body.status);
  if (req.body.status==true){
      console.log("true called");
      BeneficiaryAdd(req,res)
  }else{
      console.log("false called");
      removeBeneficary(req, res)
  }
}

function BeneficiaryAdd(req, res,next){
  if(req.body.type == "Beneficiary1"){
    console.log("B1");
    console.log(req.body.contact._id)
    console.log(req.body.contact)
    
    if(req.body.contact._id==undefined ||req.user._id==undefined){
      console.log("NULL VALUE OBTAINED")
      return res.send("UNDEFINED FROM CLIENT REQUEST")
    }
editors.findOne({ _id : safeObjectId(req.body.file._id) }, function (err, docs) { 
  console.log("ssss"+docs);
if(docs == null){  
 var user1 = new editors({
  user_id :req.user._id ,
  //filename :req.body.file.filename,
  //file_id :req.body.file.file_id,
  status : true,
  //rename to type..
  
 //BenficeryType :
  Beneficiary1 : 
{
  contactId:req.body.contact._id,
  shared_on : new Date,
  status : true
}
});

//Saving the model instance to the DB
user1.save(function(err){
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
  console.log(user1)
  if ( err ) throw err;
  console.log("Benficery Saved Successfully");
});
}else{
pushBeneficery1(req,res,next);

}

})
}else if(req.body.type == "Beneficiary2"){
      console.log("B2");
      if(req.body.contact._id==undefined ||req.user._id==undefined){
        console.log("NULL VALUE OBTAINED")
        return res.send("UNDEFINED FROM CLIENT REQUEST")
      }
editors.findOne({ _id : safeObjectId(req.body.file._id)}, function (err, docs) { 
  console.log("ssss"+docs);


if(docs == null){  
 var user1 = new editors({
  user_id :req.user._id,
  //filename :req.body.file.filename,
  //file_id :req.body.file.file_id,
  status : true,
  //rename to type..
  
  //BenficeryType :
  Beneficiary2 : 
{
  contactId:req.body.contact._id,
  shared_on : new Date,
  status : true
}
});

//Saving the model instance to the DB
user1.save(function(err){
  if ( err ) throw err;
  console.log("Benficery2 Saved Successfully");
});
}else{
pushBeneficery2(req,res,next);
}

})
}
else if(req.body.type == "Beneficiary3"){
      console.log("B3");
      if(req.body.contact._id==undefined ||req.user._id==undefined){
        console.log("NULL VALUE OBTAINED")
        return res.send("UNDEFINED FROM CLIENT REQUEST")
      }
editors.findOne({ _id : safeObjectId(req.body.file._id) }, function (err, docs) { 
  console.log("ssss"+docs);


if(docs == null){  
 var user1 = new editors({
  user_id :req.user._id,
    //filename :req.body.file.filename,
  //file_id :req.body.file.file_id,
  status : true,
  //rename to type..
  
  //BenficeryType :
  Beneficiary1 : 
{
  contactId:req.body.contact._id,
  shared_on : new Date,
  status : true
}
});

//Saving the model instance to the DB
user1.save(function(err){
  if ( err ) throw err;
  console.log("Benficery3 Saved Successfully");
});
}else{
pushBeneficery3(req,res,next);

}

})

}else{
  return res.send("UNDEFINED FROM CLIENT REQUEST")
}
}
//pushing data to Ben1 if already that fileID exists
function pushBeneficery1(req, res, next){
  
  //  var BenficeryType1=req.body.type; 
  //      console.log(BeneficeryType1);
    console.log("getfile called");
    console.log(req.body);
    if(req.body.contact._id==undefined){
      console.log("NULL VALUE OBTAINED")
      return res.send("UNDEFINED FROM CLIENT REQUEST")
    }
    editors.findOne({'Beneficiary1.contactId': req.body.contact._id},function(err,docs){
      if(err) throw err
  
      if(docs!=null){
        return res.send('Already added')
      }
    })
  editors.update({_id : safeObjectId(req.body.file._id) },{$push: {
                //rename to type..
            Beneficiary1:
                    { 
                     "status"       : "true",
                      "shared_on"    : new Date(),
                      "contactId"    : req.body.contact._id
                  } 
       
  }},{upsert:true},function(err){
          if(err){
                  console.log(err);
          }else{
                  console.log("Successfully Pushed");
          }
  });
  }
  
  
  //pushing data to Ben2 if already that fileID exists
  function pushBeneficery2(req, res, next){
    console.log("getfile called");
    console.log(req.body);
    if(req.body.contact._id==undefined){
      console.log("NULL VALUE OBTAINED")
      return res.send("UNDEFINED FROM CLIENT REQUEST")
    }

    editors.findOne({'Beneficiary2.contactId': req.body.contact._id},function(err,docs){
      if(err) throw err
  
      if(docs!=null){
        return res.send('Already added')
      }
    })
  editors.update({_id : safeObjectId(req.body.file._id)},{$push: {
                //rename to type..
            Beneficiary2:
                    { 
                     "status"       : "true",
                      "shared_on"    : new Date(),
                      "contactId"    : req.body.contact._id
                  } 
         
  }},{upsert:true},function(err){
          if(err){
                  console.log(err);
          }else{
                  console.log("Successfully Pushed");
          }
  });
  }
  //pushing data to Ben3 if already that fileID exists
  
  function pushBeneficery3(req, res, next){
  
   console.log("getfile called");
    console.log(req.body);
    if(req.body.contact._id==undefined){
      console.log("NULL VALUE OBTAINED")
      return res.send("UNDEFINED FROM CLIENT REQUEST")
    }
    editors.findOne({'Beneficiary3.contactId': req.body.contact._id},function(err,docs){
      if(err) throw err
  
      if(docs!=null){
        return res.send('Already added')
      }
    })
  editors.update({_id : safeObjectId(req.body.file._id) },{$push: {
                //rename to type..
            Beneficiary3:
                    { 
                     "status"       : "true",
                      "shared_on"    : new Date(),
                      "contactId"    : req.body.contact._id
                  } 
  }},{upsert:true},function(err){
          if(err){
                  console.log(err);
          }else{
                  console.log("Successfully Pushed");
          }
  });
  }

  function removeBeneficary(req, res, next){
    console.log("delete coinatc")
     if(req.body.type=="Beneficiary1"){
        console.log("Inside BEN1")
   
        editors.update(
          { "userId": req.user._id },
          { "$pull": { "Beneficiary1": { "contactId": req.body.contact._id } } },

          function(err, numAffected) {
                        if(err){
                  console.log(err);
              } else {
                  res.status(200).send();
              }
          }
      );
   
     }else if(req.body.type=="Beneficiary2"){
            console.log("Inside BEN2")
        console.log(req.body.contact._id)
            editors.update(
              { "userId": req.user._id },
              { "$pull": { "Beneficiary2": { "contactId": req.body.contact._id } } },
              function(err, numAffected) { 
                  if(err){
                      console.log(err);
                  } else {
                      res.status(200).send();
                  }
              }
          );
   
     }else if(req.body.type=="Beneficiary3"){
            console.log("Inside BEN3")
   
            editors.update(
              { "userId": req.user._id },
              { "$pull": { "Beneficiary3": { "contactId": req.body.contact._id } } },
              function(err, numAffected) { 
                  if(err){
                      console.log(err);
                  } else {
                      res.status(200).send();
                  }
              }
          );
     }
   }




function putEditor (req, res, next) {

  console.log("put called");
  
  var hw1 = encrypt(req.body.text)
  
     console.log(req.body);
     console.log(req.user._id);
 
   editors.findOneAndUpdate({_id : safeObjectId(req.body.id)}, {$set: {title : req.body.title},data: hw1}, {new: true},
     function(err, results){
    
    if (err) return res.send(500, { error: err });
   
    res.send(results);
    console.log("the res is"+results)
});

   console.log(encrypt(hw1));
  }


function getEditorById (req, res, next) {
console.log("started");
    function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
  console.log(req.editor.data);

var hw = decrypt(req.editor.data)
// outputs hello world
   console.log(hw);
   req.editor.data = hw;
   res.send(req.editor);


}

function paramEditor (req, res, next, id) {
  req.assert('editorId', 'Your Editor ID cannot be blank').notEmpty()
  req.assert('editorId', 'Your Editor ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      message: errors[0].message,
      redirect: '/'
    })
  }
  auto({
    editor: function (cb) {
      editors
        .findOne({_id: id})
        .exec(cb)
    }
  }, function (error, results) {
    if (error) return next(error)
    req.editor = results.editor
    next()
  })
}