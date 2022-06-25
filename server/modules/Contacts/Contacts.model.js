var mongoose = require('mongoose')
var __name__Schema = mongoose.Schema({
firstName:{
 type:String,
 default:""
},
lastName:{
 type:String,
 default:""
},
gender:{
 type:String,
 default:""
},
dob:{
 type:String,
 default:""
},
primaryEmail:{
 type:String,
 default:"",
 lowercase: true
},
secondaryEmail:{
 type:String,
 default:""
},
addressLine1:{
 type:String,
 default:""
},
addressLine2:{
 type:String,
 default:""
},
city:{
 type:String,
 default:""
},
state:{
 type:String,
 default:""
},
country:{
 type:String,
 default:""
},
zipCode:{
 type:String,
 default:""
},
relationship:{
 type:String,
 default:""
},
role:{
 type:String,
 default:""
},
mobilePhone:{
 type:Array,
 default:""
},
user_id:{
    type: String,
    default : ""
  },
user: {
  type: mongoose.Schema.ObjectId,
  ref: 'users'
},
level:{
  type: String,
  default: ""
}
})
module.exports = __name__Schema
