import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required:true,
  },

  products:[
    {
      productId:{
        type:String    
      },
      productTitle:{
        type : String
      },
      quantity:{
        type:Number
      },
      price:{
        type:Number
      },
      image:{
        type : String
      },
      subTotal:{
        type : String
      }
  }
],

paymentId : {
    type : String,
    default : ""
  },

  payment_status : {
    type : String,
    default : ""
  },
  order_status:{
    type:String,
    default:"pending"
  },
  delivery_address : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'address'
  },

  totalAmt : {
    type : Number,
    default : 0
  },
  subTotalAmt : {
    type : Number,
    default : 0
  },

  invoice_receipt : {
    type : String,
    default : ""
  }
},{
  timestamps : true
})

const OrderModel = mongoose.model('order', orderSchema)

export default OrderModel