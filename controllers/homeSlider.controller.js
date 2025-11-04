import HomeSliderModel from "../models/homeSlider.model.js";
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


// create slide

export async function createHomeSlide(request, response) {
   try {
    let slide = new HomeSliderModel({
      images: imagesArr,
    
    });

    if(!slide){
      response.status(500).json({
        message: "Slide not Created",
        error: true,
        success: false,
      });
    }

    slide = await slide.save();
    imagesArr = [];

    response.status(200).json({
      message: "Slide Created",
      error: false,
      success: true,
      slide: slide
    });

   } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
   }
}

export async function getHomeSlides(request,response) {
  try {
    const slides = await HomeSliderModel.find();

    if(!slides){
      return response.status(404).json({
        message: "Slide not Found", 
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success:true,
      data:slides
    })

  } catch (error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// get single slide
export async function getSlide(request,response) {
  try {
    const slide = await HomeSliderModel.findById(request.params.id);

    if(!slide){
      response.status(404).json({
        message: "the Slide with given ID was not found.",
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      slide:slide
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// delete image
export async function removeImageFromCloudinary(request, response) {
  const imgUrl = request.query.img;

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  if(imageName){
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result)=> {
        // console.log(error, res)
      }
    );

    if(res) {
      return response.status(200).json({
        error:false,
        success:true,
        message:"Image Deleted Successfully"
      });
    }
  }
  
}

// delete slide
export async function deleteSlide(request,response) {
  const slide = await HomeSliderModel.findById(request.params.id);
  const images = slide.images;
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


      const deletedSlide = await HomeSliderModel.findByIdAndDelete(request.params.id);
      if(!deletedSlide){
        response.status(400).json({
          message: "Slide not found",
          error: true,
          success: false
        });
      }

      response.status(200).json({
        message: "Slide Deleted",
        error: false,
        success: true
      })
}

//delete multiple Slide
export async function deleteMultipleSlide(request, response){
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(400).json({
      error: true,
      success:false,
      message:"Invalid Input"
    });
  }

  for(let i=0; i<ids?.length; i++){
    const slide = await HomeSliderModel.findById(ids[i]);

    const images = slide.images;
    
          let img="";
           for(img of images){
             const imgUrl = img;
             const urlArr = imgUrl.split("/");
             const image = urlArr[urlArr.length - 1];

             const imageName = image.split(".")[0];

             if(imageName){
              cloudinary.uploader.destroy(imageName,(error,result )=>{
                // console.log(error, result)
              })
             }

  if(imageName){
    cloudinary.uploader.destroy(imageName, (error, result) => {

    });
  }
}
    
  }

  try {
    await HomeSliderModel.deleteMany({_id: {$in: ids}});

    return response.status(200).json({
      message: "Slide Deleted Successfully",
      error:false,
      success:true
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }

}

//  update Slide
export async function updateSlide(request,response) {
  const Slide = await HomeSliderModel.findByIdAndUpdate(
    request.params.id,
    {
      images: imagesArr.length >0 ? imagesArr[0] : request.body.images,
    },
    {new: true}
  );

  if(!Slide){
    response.status(404).json({
      message: "Slide cannot be Updated",
      error: true,
      success: false
    });
  }

  imagesArr = [];

  response.status(200).json({
    error: false,
    success: true,
    Slide: Slide,
     message:"Slide updated Successfully"
  })
}  

