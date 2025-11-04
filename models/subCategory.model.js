import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  parentSubCatName :{
      type: String,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subCategory',
    default: null
  }
},{timestamps : true })

const subCategoryModel = mongoose.model('subCategory', subCategorySchema)

export default subCategoryModel;