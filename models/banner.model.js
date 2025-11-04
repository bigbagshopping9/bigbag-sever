import mongoose from "mongoose";
import { type } from "os";


const bannerSchema = mongoose.Schema({
  bannerTitle:{
    type: String,
    default:"",
    required:true
  },

  images: [
    {
      type: String,
    }
  ],
  catId:{
    type: String,
    default:"",
  },
  subCatId:{
    type: String,
    default:"",
  },
  price:{
    type: Number,
    default:"",
  },
  alignInfo:{
    type: String,
    default:"",
    required:true
  },
},{
  timestamps: true
})

const BannerModel = mongoose.model('banner',bannerSchema)

export default BannerModel;