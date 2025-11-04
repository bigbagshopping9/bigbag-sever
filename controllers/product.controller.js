import ProductModel from "../models/product.model.js";
import productWeightModel from "../models/productWeight.model.js";
import productSizeModel from "../models/productSize.model.js";
import productRamModel from "../models/productRam.model.js";

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
import { error } from "console";
import { request } from "http";
import productModel from "../models/product.model.js";
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

//bannerimage upload
var bannerImages = [];
export async function uploadBannerImages(request, response) {
   try
   {
     bannerImages = [];

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
        
          bannerImages.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
    
    }  

     return response.status(200).json({
       images: bannerImages
     });


   } catch (error){
       return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
       })
   }
}

// create product
export async function createProduct(request, response) {
  try {

    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: imagesArr,
      bannerimages:bannerImages,
      bannerTitlename:request.body.bannerTitlename,
      isDisplayOnHomeBanner: request.body.isDisplayOnHomeBanner,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      category: request.body.category,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      subCatName: request.body.subCatName,
      thirdsubCat: request.body.thirdsubCat,
      thirdsubCatName: request.body.thirdsubCatName,
      thirdsubCatId: request.body.thirdsubCatId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      isDealOfDay: request.body.isDealOfDay,
      isTopPick: request.body.isTopPick,
      isFestivalGift: request.body.isFestivalGift,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
    });

    product = await product.save();

      
    if(!product) {
      response.status(500).json({
        error: true,
        success: false,
        message: "Product not Created"
      });
    }

    imagesArr = [];

    response.status(200).json({
      message: "Product Created Successfully",
      error: false,
      success: true,
      product: product
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product
export async function getAllProducts(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find().populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by Category Id
export async function getAllProductsByCatId(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({catId:request.params.id}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by Category name
export async function getAllProductsByCatName(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({catId:request.params.catId}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by sub Category Id
export async function getAllProductsBySubCatId(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({subCatId:request.params.id}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by sub Category name
export async function getAllProductsBySubCatName(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({subCat:request.params.subCat}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by third sub Category Id
export async function getAllProductsByThirdSubCatId(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({thirdsubCatId:request.params.id}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// get all product by third sub Category name
export async function getAllProductsByThirdSubCatName(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

    const products = await ProductModel.find({thirdsubCat:request.query.thirdsubCat}).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

//get all products by price

export async function getAllProductsByPrice(request,response) {
  let productList = [];

  if(request.query.catId !== "" && request.query.catId !== undefined){
    const productListArr = await ProductModel.find({
      catId: request.query.catId,
    }).populate("category");

    productList = productListArr
  }

  if(request.query.subCatId !== "" && request.query.subCatId !== undefined){
    const productListArr = await ProductModel.find({
      subCatId: request.query.subCatId,
    }).populate("category");

    productList = productListArr
  }

  if(request.query.thirdsubCatId !== "" && request.query.thirdsubCatId !== undefined){
    const productListArr = await ProductModel.find({
      thirdsubCatId: request.query.thirdsubCatId,
    }).populate("category");

    productList = productListArr
  }

  const filteredProducts = productList.filter((product) =>{
    if(request.query.minPrice && product.price < parseInt(+request.query.minPrice)) {
      return false;
    }
    if(request.query.maxPrice && product.price > parseInt(+request.query.maxPrice)){
      return false;
    }
    return true;
  });

  return response.status(200).json({
    success: true,
    error: false,
    products: filteredProducts,
    totalPages: 0,
    page: 0,
  });
}

// get all products bt rating
export async function getAllProductsByRating(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages) {
      return response.status(404).json(
        {
        message: "Page not Found",
        error: true,
        success: false
        }
    );
  }  

   let products=[];

   if(request.query.catId!==undefined){
    products = await ProductModel.find({
      rating:request.query.rating,
      catId:request.query.catId,
    }).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
   }

   if(request.query.subCatId!==undefined){
    products = await ProductModel.find({
      rating:request.query.rating,
      subCatId:request.query.subCatId,
    }).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
   }

   if(request.query.thirdsubCatId!==undefined){
    products = await ProductModel.find({
      rating:request.query.rating,
      thirdsubCatId:request.query.thirdsubCatId,
    }).populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
   }

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

//get all products counts
export async function getAllProductsCount(request,response) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if(!productsCount){
      response.status(500).json({
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      productsCount:productsCount
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

//get all features products
export async function getAllFeaturedProducts(request, response) {
  try {

    const products = await ProductModel.find({isFeatured:true}).populate("category")
    

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// delete products
export async function deleteProduct(request, response) {
const product = await ProductModel.findById(request.params.id).populate("category");

if(!product){
  return response.status(500).json({
    message: "Product Not Found",
    error: true,
    success: false
  });
}

const images = product.images;

let img="";
for(img of images){
  const imgUrl = img;
  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  if(imageName){
    cloudinary.uploader.destroy(imageName, (error, result) => {

    });
  }
}

const deleteProduct = await ProductModel.findByIdAndDelete(request.params.id);

if(!deleteProduct){
  response.status(404).json({
    message: "Product Not Deleted",
    error: true,
    success: false
  });
}

return response.status(200).json({
  success: true,
  error: false,
  message: "Product Deleted"
});

}

//delete multiple products
export async function deleteMultipleProduct(request, response){
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(400).json({
      error: true,
      success:false,
      message:"Invalid Input"
    });
  }

  for(let i=0; i<ids?.length; i++){
    const product = await ProductModel.findById(ids[i]);

    const images = product.images;
    
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
    await ProductModel.deleteMany({_id: {$in: ids}});

    return response.status(200).json({
      message: "Product Deleted Successfully",
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


//get single products
export async function getProduct(request, response){
  try {
    const product = await ProductModel.findById(request.params.id).populate("category");

    if(!product) {
      return response.status(404).json({
        message: "The Product is Not Found",
        error:true,
        success:false
      });
    }

    return response.status(200).json({
      error:false,
      success:true,
      product:product
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

//delete Images
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
      response.status(200).send(res);
    }
  }
  
}

//update product
export async function updateProduct(request,response) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        subCat: request.body.subCat,
        description: request.body.description,
        images: request.body.images,
        bannerimages:request.body.bannerimages,
        bannerTitlename:request.body.bannerTitlename,
        isDisplayOnHomeBanner: request.body.isDisplayOnHomeBanner,
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        catId: request.body.catId,
        catName: request.body.catName,
        subCatId: request.body.subCatId,
        thirdsubCat: request.body.thirdsubCat,
        thirdsubCatId: request.body.thirdsubCatId,
        category: request.body.category,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        isDealOfDay: request.body.isDealOfDay,
        isTopPick: request.body.isTopPick,
        isFestivalGift: request.body.isFestivalGift,
        productRam: request.body.productRam,
        size: request.body.size,
        productWeight: request.body.productWeight,
      },
      { new: true }
    );

    if(!product) {
      return response.status(404).json({
        message: "Product cannot be Updated",
        error: true,
        success: false
      });
    }

    imagesArr = [];

    return response.status(200).json({
      message: "Product is Updated",
      error:false,
      success:true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}


// create product weight
export async function createProductWeight(request,response) {
  try {
    let productWeight = new productWeightModel({
      name:request.body.name
    })

    productWeight = await productWeight.save();

    if(!productWeight){
      response.status(401).json({
        error:true,
        success:false,
        message:"Product Weight Not Created"
      });
    }

    return response.status(200).json({
      error:false,
      success:true,
      message:"Product Weight created Successfully",
      product:productWeight
    })
  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

export async function deleteProductWeight(request,response) {

    const productWeight = await productWeightModel.findById(request.params.id);

    if(!productWeight){
      return response.status(401).json({
        message:"Item not Found",
        error:true,
        success:false
      })
    }

    const deleteProductWeight = await productWeightModel.findByIdAndDelete(request.params.id);

    if(!deleteProductWeight){
      response.status(404).json({
        error:true,
        success:false,
        message:"Item not Deleted"
      })
    }

    return response.status(200).json({
    message: "Product Weight Deleted",
    error:false,
    success:true
  })
}

// delete multiple product weight

export async function deleteMultipleProductWeight(request,response) {
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(401).json({
      error:true,
      success:false,
      message:"Invalid Input"
    })
  }

  try {
    await productWeightModel.deleteMany({_id: {$in: ids}});
    return response.status(200).json({
      message:"Product Weight Deleted Successfully",
      error:false,
      success:true
    })

  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

// update product weight 

export async function updateProductWeight(request,response) {
  try {
    
    const productWeight = await productWeightModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      {new: true}
    );

    if(!productWeight){
      return response.status(401).json({
        message: "product weight can't be Updated",
        error:true,
        success:false
      });
    }

    return response.status(200).json({
      message: "product weight is Updated",
      error:false,
      success:true
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductWeight(request,response) {
  try {
    const productWeight = await productWeightModel.find();

    if(!productWeight){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productWeight
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductWeightById(request,response) {
  try {
    const productWeight = await productWeightModel.findById(request.params.id);

    if(!productWeight){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productWeight
    })

  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }
}


// create product Size

export async function createProductSize(request,response) {
  try {
    let productSize = new productSizeModel({
      name:request.body.name
    })

    productSize = await productSize.save();

    if(!productSize){
      response.status(401).json({
        error:true,
        success:false,
        message:"Product Size Not Created"
      });
    }

    return response.status(200).json({
      error:false,
      success:true,
      message:"Product Size created Successfully",
      product:productSize
    })
  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

export async function deleteProductSize(request,response) {

    const productSize = await productSizeModel.findById(request.params.id);

    if(!productSize){
      return response.status(401).json({
        message:"Item not Found",
        error:true,
        success:false
      })
    }

    const deleteProductSize = await productSizeModel.findByIdAndDelete(request.params.id);

    if(!deleteProductSize){
      response.status(404).json({
        error:true,
        success:false,
        message:"Item not Deleted"
      })
    }

    return response.status(200).json({
    message: "Product Size Deleted",
    error:false,
    success:true
  })
}

// delete multiple product Size

export async function deleteMultipleProductSize(request,response) {
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(401).json({
      error:true,
      success:false,
      message:"Invalid Input"
    })
  }

  try {
    await productSizeModel.deleteMany({_id: {$in: ids}});
    return response.status(200).json({
      message:"Product Size Deleted Successfully",
      error:false,
      success:true
    })

  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

// update product Size 

export async function updateProductSize(request,response) {
  try {
    
    const productSize = await productSizeModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      {new: true}
    );

    if(!productSize){
      return response.status(401).json({
        message: "product Size can't be Updated",
        error:true,
        success:false
      });
    }

    return response.status(200).json({
      message: "product Size is Updated",
      error:false,
      success:true
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductSize(request,response) {
  try {
    const productSize = await productSizeModel.find();

    if(!productSize){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productSize
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductSizeById(request,response) {
  try {
    const productSize = await productSizeModel.findById(request.params.id);

    if(!productSize){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productSize
    })

  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }
}

// create product Ram

export async function createProductRam(request,response) {
  try {
    let productRam = new productRamModel({
      name:request.body.name
    })

    console.log(request.body.name)

    productRam = await productRam.save();

    if(!productRam){
      response.status(401).json({
        error:true,
        success:false,
        message:"Product Ram Not Created"
      });
    }

    return response.status(200).json({
      error:false,
      success:true,
      message:"Product Ram created Successfully",
      product:productRam
    })
  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

export async function deleteProductRam(request,response) {

    const productRam = await productRamModel.findById(request.params.id);

    if(!productRam){
      return response.status(401).json({
        message:"Item not Found",
        error:true,
        success:false
      })
    }

    const deleteProductRam = await productRamModel.findByIdAndDelete(request.params.id);

    if(!deleteProductRam){
      response.status(404).json({
        error:true,
        success:false,
        message:"Item not Deleted"
      })
    }

    return response.status(200).json({
    message: "Product Ram Deleted",
    error:false,
    success:true
  })
}

// delete multiple product Ram

export async function deleteMultipleProductRam(request,response) {
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(401).json({
      error:true,
      success:false,
      message:"Invalid Input"
    })
  }

  try {
    await productRamModel.deleteMany({_id: {$in: ids}});
    return response.status(200).json({
      message:"Product Ram Deleted Successfully",
      error:false,
      success:true
    })

  } catch (error) {
    return response.status(500).json({
      error:true,
      success:false,
      message:error.message || error
    })
  }
}

// update product Size 

export async function updateProductRam(request,response) {
  try {
    
    const productRam = await productRamModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      {new: true}
    );

    if(!productRam){
      return response.status(401).json({
        message: "product Ram can't be Updated",
        error:true,
        success:false
      });
    }

    return response.status(200).json({
      message: "product Ram is Updated",
      error:false,
      success:true
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductRam(request,response) {
  try {
    const productRam = await productRamModel.find();

    if(!productRam){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productRam
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export async function getProductRamById(request,response) {
  try {
    const productRam = await productRamModel.findById(request.params.id);

    if(!productRam){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      data:productRam
    })

  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }
}

export async function filters(request,response){
  const {catId, subCatId, minPrice, maxPrice, rating, page, limit} = request.body;

  const filters = {}

  if(catId?.length){
     filters.catId = {$in: catId}
  }

  if(subCatId?.length){
     filters.subCatId = {$in: subCatId}
  }

  if(minPrice || maxPrice){
     filters.price = {$gte: +minPrice || 0, $lte: +maxPrice || Infinity };
  }

  if(rating?.length){
     filters.rating = {$in: rating}
  }

 try {
  const products = await ProductModel.find(filters).populate("category").skip((page-1) * limit).limit(parseInt(limit))

  const total = await ProductModel.countDocuments(filters);

  return response.status(200).json({
    error:false,
    success:true,
    products: products,
    total:total,
    page:parseInt(page),
    totalPages: Math.ceil(total / limit)
  })

 } catch (error) {
   return response.status(500).json({
    message: error.message || error,
    error:true,
    success:false
   })
 }

}


const sortItems=(products, sortBy, order)=>{
  return products.sort((a,b)=>{

    if(sortBy === 'name'){
      return order === 'asc' ? a.name.localeCompare(b.name) :
       b.name.localeCompare(a.name)
    }  
    
    if(sortBy === "price"){
    return order === 'asc' ? a.price - b.price : b.price - a.price
  }

  return 0;
  })

}

export async function sortBy(request,response) {
   const {products ,sortBy, order} = request.body;
   const sortedItems = sortItems ([...products?.products], sortBy, order);

   return response.status(200).json({
    error: false,
    success: true,
    products:sortedItems,
    page:0,
    totalPages:0
   })
}


export async function searchProductController(request,response) {
  try {
    // const query = request.query.q;
    const{page,limit,query} = request.body;

    if(!query){
      return response.status(404).json({
        message:"Query is Required",
        error:true,
        success:false
      })

    }

    const products = await ProductModel.find({
      $or:[
        {
          name:{$regex:query, $options:"i"}
        },
         {
          brand:{$regex:query, $options:"i"}
        },
         {
          catName:{$regex:query, $options:"i"}
        },
         {
          subCatName:{$regex:query, $options:"i"}
        },
      ]
    }).populate("category")

    const total = await products?.length


    return response.status(200).json({
      error:false,
      success:true,
      products: products,
    total:1,
    page:parseInt(page),
    totalPages: 1
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// ✅ Get all deals of the day
export async function getDealsOfTheDay(request, response) {
  try {

    const products = await ProductModel.find({isDealOfDay:true}).populate("category")
    

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// ✅ Get all top picks
export async function getTopPicks(request, response) {
  try {

    const products = await ProductModel.find({isTopPick:true}).populate("category")
    

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

// ✅ Get all festival gift
export async function getFestivalGift(request, response) {
  try {

    const products = await ProductModel.find({isFestivalGift:true}).populate("category")
    

    if(!products){
      response.status(500).json({
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}
