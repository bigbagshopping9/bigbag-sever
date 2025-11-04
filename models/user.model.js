import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name : {
    type : String,
    required : [true,"provide name"]
  },
  phone : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : [true, "provide Password"]
  },
  avatar : {
    type : String,
    default : ""
  },
  mobile : {
    type : Number,
    default : null
  },
  access_token : {
    type: String,
    default: ''
  },
  refresh_token : {
    type : String,
    default : ''
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  last_login_date : {
    type : Date,
    default : ""
  },
  status : {
    type : String,
    enum : ["Active", 'Inactive', "Suspended"],
    default : "Active"
  },
  address_details : [ {
    type : mongoose.Schema.ObjectId,
    ref :'address'
  }
],
  shopping_cart : [{
    type : mongoose.Schema.ObjectId,
    ref : 'cartProduct'
  }
],
  orderHistory : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'order'
    }
  ],
  
  
  otp : {
    type: String
  },
  otpExpires : {
    type: Date
  },

  // userId : {
  //   type : mongoose.Schema.ObjectId,
  //   default : ""
  // },

  role : {
    type : String,
    enum : ['ADMIN', "USER"],
    default : "USER"
  }, 
  registerWithGoogle :{
    type:Boolean,
    default:false
  }
}, {
  timestamps : true
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel;