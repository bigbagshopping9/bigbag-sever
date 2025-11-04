import mongoose from "mongoose";

const homeSliderSchema = mongoose.Schema({
  images:[
    {
      type: String,
      required: true
    }
  ],

  dateCreated: {
    type: Date,
    default: Date.now
  },
},{
  Timestamp: true
});

const HomeSliderModel = mongoose.model('HomeSlider', homeSliderSchema);

export default HomeSliderModel;