import mongoose, { mongo } from "mongoose";

const productWeightSchema = mongoose.Schema({
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

const productWeightModel = mongoose.model('productWeight', productWeightSchema)

export default productWeightModel;