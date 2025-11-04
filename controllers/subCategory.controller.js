import CategoryModel from "../models/subCategory.model.js";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
import subCategoryModel from "../models/subCategory.model.js";
dotenv.config();


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret:process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure:true,
});

export default cloudinary;


// create subCategory

export async function createSubCategory(request, response) {
   try {
    let subCategory = new subCategoryModel({
      name: request.body.name,
      parentId: request.body.parentId,
      parentSubCatName: request.body.parentSubCatName,
    });

    if(!subCategory){
      response.status(500).json({
        message: "subCategory not Created",
        error: true,
        success: false,
      });
    }

    subCategory = await subCategory.save();
    imagesArr = [];

    response.status(200).json({
      message: "subCategory Created",
      error: false,
      success: true,
      subCategory: subCategory
    });

   } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
   }
}

// get sub category 
export async function getSubCategories(request, response) {
   try {
    const subCategories = await subCategoryModel.find();
    const subCategoryMap = {};

    subCategories.forEach(cat => {
      subCategoryMap[cat._id] = {...subCat._doc, children: []};
    });

    const rootSubCategories = [];

    subCategories.forEach(cat => {
      if(subCat.parentId) {
        subCategoryMap[subCat.parentId].children.push(subCategoryMap[subCat._id]);
      }else{
        rootSubCategories.push(subCategoryMap[subCat._id]);
      }
    });

    return response.status(200).json({
      error: false,
      success: true,
      data:rootSubCategories
    })

   } catch (error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
   }
}

//get sub categories count

export async function getSubCategoriesCount(request,response) {
  try {
    const subCategories = await subCategoryModel.find();

    if (!subCategories) {
      response.status(500).json({
        success: false,
        error: true
      });
    } else {
      const subCatList = [];
       for(let cat of subCategories){
        if(subCat.parentId!==undefined){
          subCatList.push(subCat);
        }
       }

       response.send({
        suCategoryCount: subCatList.length,
       });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// get single sub category
export async function getSubCategory(request,response) {
  try {
    const subCategory = await subCategoryModel.findById(request.params.id);

    if(!subCategory){
      response.status(500).json({
        message: "the sub category with given ID was not found.",
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      subCategory:subCategory
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function deleteSubCategory(request,response) {

  const subCategory = await CategoryModel.find({
    parentId: request.params.id
  });
  
      for( let i = 0; i < subCategory.length; i++) {
      
    
        const thirdsubCategory = await subCategoryModel.find({
          parentId: subCategory[i]._id
        });
    
        for(let i = 0; i < thirdsubCategory.length; i++) {
          const deletedThirdSubCat = await subCategoryModel.findByIdAndDelete(thirdsubCategory[i]._id);
        }
    
        const deletedSubCat = await subCategoryModel.findByIdAndDelete(subCategory[i]._id);
      }

      const deleteSubCat = await subCategoryModel.findByIdAndDelete(request.params.id);
      if(!deleteSubCat){
        response.status(400).json({
          message: "sub category not found",
          error: true,
          success: false
        });
      }

      response.status(200).json({
        message: "sub Category Deleted",
        error: false,
        success: true
      })
}

//  update sub category
export async function updateSubCategory(request,response) {
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    request.params.id,
    {
      name: request.body.name,
      parentSubCatName: request.body.parentSubCatName
    },
    {new: true}
  );

  if(!subCategory){
    response.status(500).json({
      message: "sub category cannot be Updated",
      error: true,
      success: false
    });
  }


  response.status(200).json({
    error: false,
    success: true,
    subCategory: subCategory,
     message:"sub Category updated Successfully"
  })
}    