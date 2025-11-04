import mongoose, { mongo } from "mongoose";

const productSizeSchema = mongoose.Schema({
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

const productSizeModel = mongoose.model('productSize', productSizeSchema)

export default productSizeModel;