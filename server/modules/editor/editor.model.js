var mongoose = require('mongoose')
var __name__Schema = mongoose.Schema({
userId:{ 
 type:String, 
 default:""
},
data:{ 
 type:String, 
 default:""
},
title:{
type:String,
default:""
},
status :{
    type: Boolean,
    default : ""
},
   Beneficiary1 : 
        {
            type: Array,
              default: [],

              contactId : {
             type: String,
            default: ''
 },
  
    
    shared_on :{
    type: Date,
    default: ''
},
status :{
    type : Boolean,
    default : ''
}
    
},
  Beneficiary2 : 
        {
            type: Array,
              default: [],

              contactId : {
             type: String,
            default: ''

 },
    
    
    shared_on :{
    type: Date,
    default: ''
},
status :{
    type : Boolean,
    default : ''
}
    
},
  Beneficiary3 : 
        {
            type: Array,
              default: [],

              contactId : {
             type: String,
            default: ''

 },
    
    
    shared_on :{
    type: Date,
    default: ''
}
        }
})
module.exports = __name__Schema