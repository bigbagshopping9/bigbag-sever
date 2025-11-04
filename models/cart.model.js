import mongoose from "mongoose";

const cartProductSChema = new mongoose.Schema({
  productTitle:{
    type:String,
    // required:true
  },
  image:{
    type:String,
    // required:true
  },
  rating:{
    type:Number,
    // required:true
  },
  price:{
    type:Number,
    required:true
  },
   oldPrice:{
    type:Number,
  },
  discount:{
    type:Number,
  },
  quantity:{
    type:Number,
  },
  subTotal:{
    type:Number,
   
  },
  productId:{
    type:String,
    required:true
  },
  countInStock:{
    type:Number,
  },
  userId:{
    type:String,
  },
   brand:{
    type:String,
  },
   weight:{
    type:String,
  },

},{
  timestamps:true
})

const CartProductModel = mongoose.model('cart', cartProductSChema)

export default CartProductModel;