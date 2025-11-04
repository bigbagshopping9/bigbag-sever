import mongoose, { mongo } from "mongoose";

const productRamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,  
  },

  dateCreated : {
    type: Date,
    default: Date.now
  }
}, {
  Timestamp : true
});

const productRamModel = mongoose.model('productRam', productRamSchema)

export default productRamModel;