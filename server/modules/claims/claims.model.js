var mongoose = require('mongoose')
var __name__Schema = mongoose.Schema({
nominator:{ 
 type:String, 
 default:""
},
trusteeLevel:{ 
 type:String, 
 default:""
},
relationship:{ 
 type:String, 
 default:""
},
reason:{ 
    type:String, 
    default:""
},
dateofIncident:{ 
    type:String, 
    default:""
},
placeofIncident:{
    city:{
        type: String,
        default: ''
    },
    state:{
        type: String,
        default: ''
    },
    country:{
        type: String,
        default: ''
    }
},
claim_date:{
    type: Date,
    default: new Date
},

livingStatus:{
    type: String,
    default: ''
},
contactId:{
    type: Object,
    default: '',
    ref: 'Contacts'
},

cUserId:{
    type: String,
    default: ''
},
verifierReferBackComments:{
    type: String,
    default: ''
},
timeline:{
    type: Array,
    default: [],

    status:{
        type:String,
        default: ''
    },
    comments:{
        type: String,
        default: ''
    },
    date:{
        type: Date,
        default: new Date
    },
    userId:{
        type: String,
        default: ''
    }
},
contactConsensusStatus:{
    type: Boolean,
    default: false
},
contactconsensus:
{
    type: Array,
    default: [],
    
    contact_id:{
        type: String,
        default: ''
    },
    isAccepted:{
        type: Boolean,
        default: ''
    },
    comments:{
        type: String,
        default: ''
    }
},



files: 
{
    type: Array,
    default: [],

    file_id : {
    type: String,
    default: ''
    },

    fileName :
    {
    type: String,
    default: ''
    },

    fileType:
    {
    type: String,
    default: ''
    }
},

claimId:{
    type: String,
    default: function generateClaimID(){
       
        var text = "DCID";
        var possible = "0123456789";
      
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            console.log(text)
            return text;
    }
},
user_id:{
    type: String,
    default: ""
},
claimStatus:{
    type: String,
    default: "Draft"
},

statusList:{
    isClaimRegistered:{
        type: Boolean,
        default: true
        
    },
    isClaimApproved:{
        

        type: Array,
        default: [],
        
        status:{
            type: String,
            default: ''
        },
        approvedOn:{
            type: Date,
            default: new Date
        },
        comments:{
            type: String,
            default: ''
        },
        approverUserId:{
            type: String,
            default: ''
        },
        holdBackDate:{
            type: Date,
            default: ''
        }
    },
    response:{
        type: Boolean,
        default: true
    },
    contactConcurrence:{
        type: Boolean,
        default: true
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    isDocumentReleased:{
        type: Boolean,
        default: false
    },
    



},

approverConclusion:{

        approvedByContactConsensus:{
            type: Boolean,
            default: ''
        },
        approvedByMajorty:{
            type: Boolean,
            default: ''
        },
        approvedByNoBlockingResponse:{
            type: Boolean,
            default: ''
        },
        approvedByVerfier:{
            type: Boolean,
            default:''
        },
        approverUserId:{
            type: String,
            default: ''
        }

},

comments:{
    nomineeComments:{
        

        type: Array,
        default: [],
        
        comments:{
            type: String,
            default: 'sasassas'
        },
        commentDate:{
            type: Date,
            default: new Date
        },
        
        nomineeUserId:{
            type: String,
            default: ''
        }
      
    },
    verifierComments:{
        

        type: Array,
        default: [],
        
        comments:{
            type: String,
            default: 'sasassas'
        },
        commentDate:{
            type: Date,
            default: new Date
        },
        
        verifierUserId:{
            type: String,
            default: ''
        },
        status:{
            type: String,
            default: ''
        }
      
    },
    approverComments:{
        

        type: Array,
        default: [],
        
        comments:{
            type: String,
            default: 'sasassas'
        },
        commentDate:{
            type: Date,
            default: new Date
        },
        
        approverUserId:{
            type: String,
            default: ''
        },
        status:{
            type: String,
            default: ''
        },
        approverHoldBackDate:{
            type: Date,
            default: ''
        }
      
    }
}

   


 



})
module.exports = __name__Schema