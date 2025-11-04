
import myListModel from "../models/myList.model.js";

export const addToMyListController = async (request,response)=>{
  try {
    const userId = request.userId
    const {productId, productTitle, image, rating, price, oldPrice, brand, discount, } = request.body;  

   const item = await myListModel.findOne({
    userId:userId,
    productId:productId
   }) 

   if(item) {
    return response.status(400).json({
      message: "Item already in My Wishlist",
    })
   }

   const myList = new myListModel({
    productId:productId, 
    productTitle:productTitle, 
    image:image, 
    rating:rating, 
    price:price, 
    oldPrice:oldPrice, 
    brand:brand, 
    discount:discount,
    userId:userId
  })

  const save = await myList.save();

  return response.status(200).json({
    error: false,
    success:true,
    message: "Product added in my Wihslist"
  })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}

export const deleteToMyListController = async (request,response)=>{
  try {
    
    const myListItem = await myListModel.findById(request.params.id);

    if(!myListItem) {
      return response.status(404).json({
        message: "Item with this given id was not Found",
        error: true,
        success:false
      })
    }

    const deleteItem = await myListModel.findByIdAndDelete(request.params.id);

    if(!deleteItem){
      return response.status(404).json({
        message: "Item is Not Deleted",
        error: true,
        success: false
      })
    }

    return response.status(200).json({
      message: "Item Removed from My Wishlist",
      error: false,
      success:true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const getToMyListController = async (request,response)=>{
  try {
    
    const userId = request.userId;
    // console.log(userId)

    const myListItem = await myListModel.find({
      userId:userId
    })

    return response.status(200).json({
      error: false,
      success: true,
      data:myListItem
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

