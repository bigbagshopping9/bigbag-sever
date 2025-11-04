import mongoose from "mongoose";
import { type } from "os";


const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  oldPrice: {
    type: Number,
    default: 0
  },
  catName: {
    type: String,
    default: ''
  },
  catId: {
    type: String,
    default: ''
  },
  subCatId: {
    type: String,
    default: ''
  },
  subCat: {
    type: String,
    default: ''
  },
  subCatName: {
    type: String,
    default: ''
  },
  thirdsubCat: {
    type: String,
    default: ''
  },
  thirdsubCatName: {
    type: String,
    default: ''
  },
  thirdsubCatId: {
    type: String,
    default: ''
  },
  category: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Category',
    
  },
  countInStock: {
    type: Number,
    // required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: String,
    default: false
  },
  discount: {
    type: Number,
    required: true
  },
  productRam: {
    type: String,
    default: null
  },
  size: [{
    type: String,
    default: null
  }],
   sale: {
    type: Number,
    default:0
   
  },
  productWeight: [{
    type: String,
    default: null
  }],

  bannerimages: [{
    type: String,
    
  }],

  isDealOfDay:{
     type:Boolean,
     default:false
  },

  isTopPick:{
     type:Boolean,
     default:false
  },

  isFestivalGift:{
     type:Boolean,
     default:false
  },

  dealEndTime:{
    type:Date,
    default:()=>Date.now() + 24 * 60 * 60 * 1000 // 24hours from Now
  },

   bannerTitlename: {
    type: String,
   
  },

  isDisplayOnHomeBanner: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
},{Timestamp: true}
);

const ProductModel = mongoose.model('Product',productSchema)

export default ProductModel;