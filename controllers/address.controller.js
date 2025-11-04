
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async(request,response)=>{
  try {
    // const userId = request.userId
    const {address_line1, city, pincode, state, country, mobile, landmark, userId, addressType} = request.body

  const address = new AddressModel({
    address_line1, city, pincode, state, country, mobile, landmark,userId, addressType
  })

  const saveAddress = await address.save()

  const updateCartUser = await UserModel.updateOne({_id : userId},{
        $push : {
          address_details : saveAddress?._id
        }
      })

         return response.status(200).json({
      data: address,
      message: "Address Add Successfully",
      error: false,
      success: true
    })

  } catch (error) {

    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false
    })
    
  }
}

export const getAddressController = async(request,response)=>{
  try {
    const address  = await AddressModel.find({userId:request?.query?.userId});

    console.log(request?.query?.userId)

    if(!address){
      return response.status({
        error:true,
        success:false,
        message:"Address not Found"
      })
    }

    else{
      const updateUser = await UserModel.updateOne({_id: request?.query?.userId},{
        $push: {
          address_details: address?._id // yanha pr table dena h table ka name aayega 

        }
      })

      console.log(address?._id)

       return response.status(200).json({
      error:false,
      success:true,
      data:address
    })

  }

   

  } catch (error) {
     return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false
    })
  }
}

// delete Address
export const deleteAddressController = async(request,response)=>{
  try {
    const userId = request.userId
    const _id  = request.params.id

    if(!_id){
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false
      })
    }

    const deleteAddress = await AddressModel.deleteOne({_id: _id, userId : userId})

    if(!deleteAddress){
    return response.status(404).json({
      message: "This Address is not Found in Database",
      error: true,
      success: false 
    })
  }

  return response.json({
    message: "Address Remove ",
    error: false,
    success: true,
    data: deleteAddress
  })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

// get single Address

export const getSingleAddressController = async(request,response)=>{
  try {
    const id = request.params.id;

    const address = await AddressModel.findOne({_id:id});

    if(!address){
      return response.status(404).json({
        message:"Address not Found",
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      address:address
    })

  } catch (error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

// edit Address 
export async function editAddress(request, response) {
  try {

    const id = request.params.id
  
  const {address_line1, city, pincode, state, country, mobile, landmark, userId, addressType} = request.body

      const address = await AddressModel.findByIdAndUpdate(
        id,
        {
          address_line1: address_line1,
          city: city,
          pincode: pincode,
          state: state,
          country: country,
          mobile: mobile,
          landmark: landmark,
          addressType: addressType,
          
        },
        { new: true }
      )

     return response.json({
      message: "Address Updated Successfully",
      error: false,
      success: true,
      address: address
     })
  } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
  } 
}