
import CartProductModel from "../models/cart.model.js";


export const addToCartItemController = async(request,response)=>{
  try {
    const userId = request.userId  // middleWare se userId milegi
    const {productTitle,image,rating,price,oldPrice,discount,brand,quantity,subTotal,productId,countInStock,weight} = request.body

    if(!productId){
      return response.status(402).json({
        message: "Provide ProductId",
        error:true,
        success: false
      })
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId
    })

    if(checkItemCart){
      return response.status(400).json({
        message: "Item already in cart"
      })
    }

    const cartItem = new CartProductModel({
      productTitle:productTitle,
      image:image,
      rating:rating,
      price:price,
      oldPrice:oldPrice,
      discount:discount,
      quantity: quantity,
      subTotal:subTotal,
      userId: userId,
      productId: productId,
      countInStock:countInStock,
      brand:brand,
      weight:weight
    })

    const save = await cartItem.save();



    return response.status(200).json({
      data: save,
      message: "Item Add Successfully",
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    }); 
  }
}

// get Cart Item
export const getCartItemController = async(request,response)=>{
  try {
    const userId = request.userId;

    const cartItems = await CartProductModel.find({
      userId: userId
    });

    return response.json({
      data: cartItems,
      error: false,
      success: true
    })

  } catch (error) {
   return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
   }) 
  }
}

// update cart items

export const updateCartItemQtyController = async(request,response)=>{
  try {
    const userId = request.userId
    const {_id,qty,subTotal} = request.body

    if(!_id || !qty) {
      return response.status(400).json({
        message: "Provide _id, qty"
      })
    }

    const updateCartitem = await CartProductModel.updateOne({
      _id: _id,
      userId: userId
    },{
      quantity: qty,
      subTotal:subTotal
    },{
      new:true
    })

    return response.json({
      message: "Update Cart",
      error: false,
      success: true,
      data: updateCartitem
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

// delete cart items
export const deleteCartItemQtyController = async(request,response)=>{
  try {
    const userId = request.userId
    const {id} = request.params

    if(!id){
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false
      })
    }

    const deleteCartItem = await CartProductModel.deleteOne({_id: id, userId : userId})

    if(!deleteCartItem){
    return response.status(404).json({
      message: "Product Not Found In the Cart",
      error: true,
      success: false 
    })
  }



  return response.json({
    message: "Item Remove In Cart",
    error: false,
    success: true,
    data: deleteCartItem
  })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export const emptyCartController = async(request,response)=>{
  try {
    const userId = request.params.id;
    const cartItems = await CartProductModel.find({userId:userId});

    await CartProductModel.deleteMany({userId:userId})

    return response.status(200).json({
      error:false,
      success:true
    })

  } catch (error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}