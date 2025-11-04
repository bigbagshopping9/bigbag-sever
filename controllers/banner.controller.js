import BannerModel from '../models/banner.model.js';

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret:process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure:true,
});

export default cloudinary;

//image upload
var imagesArr = [];
export async function uploadImages(request, response) {
   try
   {
     imagesArr = [];

     const image = request.files;

     const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for(let i=0; i < image?.length; i++) { 
        
      const result = await cloudinary.uploader.upload(
        image[i].path,
        options);
        
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
    
    }  

     return response.status(200).json({
       images: imagesArr
     });


   } catch (error){
       return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
       })
   }
}

// create category

export async function addBanner(request, response) {
   try {
    let banner = new BannerModel({
      bannerTitle: request.body.bannerTitle,
      images: imagesArr,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      price: request.body.price,
      alignInfo: request.body.alignInfo
    });

    if(!banner){
      response.status(500).json({
        message: "Banner not Created",
        error: true,
        success: false,
      });
    }

    banner = await banner.save();
    imagesArr = [];

    response.status(200).json({
      message: "Banner Created",
      error: false,
      success: true,
      banner: banner
    });

   } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
   }
}

// get banner 
export async function getBanners(request, response) {
   try {
    const banners = await BannerModel.find();

    if(!banners){
      response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      data:banners
    })

   } catch (error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
   }
}

// get single Banner
export async function getBanner(request,response) {
  try {
    const banner = await BannerModel.findById(request.params.id);

    if(!banner){
      response.status(500).json({
        message: "the Banner with given ID was not found.",
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      banner:banner
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// delete Banner

export async function deleteBanner(request,response) {
  const banner = await BannerModel.findById(request.params.id);
  const images = banner.images;
  let img="";

  for(img of images){
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".");

    if(imageName){
      cloudinary.uploader.destroy(imageName, (error, result) => {
          // console.log(error, result);
      });
    }
  }    


      const deletedBanner = await BannerModel.findByIdAndDelete(request.params.id);
      if(!deletedBanner){
        response.status(400).json({
          message: "Banner not found",
          error: true,
          success: false
        });
      }

      response.status(200).json({
        message: "Banner Deleted",
        error: false,
        success: true
      })
}

//  update Banner
export async function updateBanner(request,response) {
  const banner = await BannerModel.findByIdAndUpdate(
    request.params.id,
    {
      bannerTitle: request.body.bannerTitle,
      images: imagesArr.length >0 ? imagesArr[0] : request.body.images,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      price: request.body.price,
      alignInfo: request.body.alignInfo
      
    },
    {new: true}
  );

  if(!banner){
    response.status(500).json({
      message: "Banner cannot be Updated",
      error: true,
      success: false
    });
  }

  imagesArr = [];

  response.status(200).json({
    error: false,
    success: true,
    banner: banner,
     message:"Banner updated Successfully"
  })
}    
