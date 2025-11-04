import mongoose from "mongoose";

const cartproductschema =  mongoose.Schema({
  productId : {
    type : mongoose.Schema.ObjectId, 
    ref : 'Product'
  },
  quantity : {
    type : Number,
    default : 1
  },
  userId : {
    type : mongoose.Schema.ObjectId,
    ref :"user"
  }
},{
  timestamps : true
})


const CartProductModel = mongoose.model('cartProduct', cartproductschema)

export default CartProductModel