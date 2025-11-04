import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import sendEmailFun from '../config/sendEmail.js';
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generateedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
import ReviewModel from '../models/review.model.js';
// import OtpModel from '../models/otp.model.js'
// import {generateOTP, hashOTP} from "../utils/otp.js"
import { sendSms } from '../utils/sms.js';
dotenv.config();

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret:process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure:true,
});

export default cloudinary;

const OTP_TTL_MIN = 5;
const MAX_OTP_ATTEMPTS = 5;

export async function registerUserController(request, response) {
  try{
    let user;
     const {name, phone, password } = request.body;
     if(!name || !phone || !password){
      return response.status(400).json({
        message: "All Fields are Required",
        error: true,
        success: false
      })
     }

      user = await UserModel.findOne({phone});
     if(user){
      return response.json({
        message: "Mobile already Registered",
        error: true,
        success: false
      })
     }

     //hash password ke liye

    const salt = await bcryptjs.genSalt(10);
     const hashPassword = await bcryptjs.hash(password,salt);
     user = new UserModel({
      name: name,
      phone: phone,
      password: hashPassword,
      isVerfied:false
    });
 await user.save();

// generate otp
// const otp = generateOTP();
// const otpHash = hashOTP(otp);
// const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min ke liye

// // save otp in db
// await OtpModel.create({phone, otpHash, expiresAt});

// send otp in mobile
// await sendSms(phone, `Your Verification code is ${otp}. It expires in 5 minutes.`);

//    return response.status(200).json({
//     success: true,
//     error:false,
//     message: "OTP send successfully!",
//    });


  }catch(error){
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
  
}


// export async function verifyOtpController(request, response) {
//   try{
//     const {phone, otp} = request.body;

//     if(!phone || !otp){
//       return response.status(400).json({
//         message:"Phone & OTP Required",
//         error:true,
//         success:false
//       });
//     }


//     const otpDoc = await OtpModel.findOne({phone}).sort({createdAt: -1});

//     if(!otpDoc){
//       return response.status(400).json({
//         message: "OTP not found",
//         error: true,
//         success: false
//       });
//     }

//     if(new Date() > otpDoc.expiresAt){
//       await OtpModel.deleteMany({phone});
//       return response.status(400).json({
//         message:"OTP Expired",
//         error:true,
//         success:false
//       });
//     }

//     const {verifyOTPHash} = await import ("../utils/otp.js");
//     const valid = verifyOTPHash(otp, otpDoc.otpHash);
//     if(!valid){
//       return response.status(404).json({
//         message:"Invalid OTP",
//         error: true,
//         success:false
//       });
//     }

//     // mark user verified
//     const user  = await UserModel.findOne({phone});

//     if(!user){
//       return response.status(404).json({
//         message:"user not Found",
//         error: true,
//         success:false
//       });
//     }

//     user.isVerfied = true;
//     await user.save();

//     await OtpModel.deleteMany({phone});

//     return response.json({
//       message: "User Verified Successfully",
//       error:false,
//       success:true
//     })
 
//   }catch(error){
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     })
//   }
  
// }

export async function authWithGoogle(request, response) {
    const {name, email, password, avatar, mobile, role} = request.body;

    try {
      const existUser = await UserModel.findOne({email: email});

      if(!existUser){
        const user = await UserModel.create({
          name: name,
          mobile:mobile,
          email:email,
          password:"null",
          avatar:avatar,
          role: role,
          verify_email:true,
          registerWithGoogle:true

        });

        await user.save();

         const accesstoken = await generatedAccessToken(user._id);
         const refreshToken = await generatedRefreshToken(user._id);

          await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
    })

         const cookiesOption = {
          httpOnly : true,
          secure: true,
          sameSite : "None"
    }

       response.cookie('accessToken', accesstoken, cookiesOption)
      response.cookie('refreshToken', refreshToken, cookiesOption)

      return response.json({
        message: "Login successfully",
        error: false,
        success: true,
        data: {
         accesstoken,
         refreshToken
    }
  })
}
else{
            const accesstoken = await generatedAccessToken(existUser._id);
            const refreshToken = await generatedRefreshToken(existUser._id);

                await UserModel.findByIdAndUpdate(existUser?._id,{
                 last_login_date : new Date()
      })

             const cookiesOption = {
                  httpOnly : true,
                  secure: true,
                  sameSite : "None"
      }

          response.cookie('accessToken', accesstoken, cookiesOption)
          response.cookie('refreshToken', refreshToken, cookiesOption)

      return response.json({
        message: "Login successfully",
        error: false,
        success: true,
        data: {
         accesstoken,
         refreshToken
    }
  })
}     

    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error:true,
        success:false
      })
    }
}

export async function loginUserController(request, response) {
 
  try{
  const {phone, password} = request.body;

  const user = await UserModel.findOne({phone:phone});

  if(!user){
    return response.status(400).json({
      message: "user not register",
      error: true,
      success: false
    })
  }
   
  // if(!user.verify_email){
  //  return response.status(400).json({
  //     message: "Your Email is not verify yet Please verify your Email First",
  //     error: true,
  //     success: false
  //   })
  // }
  
  const checkPassword = await bcryptjs.compare(password, user.password);

  if(!checkPassword){
    return response.status(400).json({
      message: "check your Password",
      error: true,
      success: false
    })
  }

  const accesstoken = await generatedAccessToken(user._id);
  const refreshToken = await generatedRefreshToken(user._id);

  const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
    last_login_date : new Date()
  })

  const cookiesOption = {
    httpOnly : true,
    secure: true,
    sameSite : "None"
  }

  response.cookie('accessToken', accesstoken, cookiesOption)
  response.cookie('refreshToken', refreshToken, cookiesOption)

  return response.json({
    message: "Login successfully",
    error: false,
    success: true,
    data: {
      accesstoken,
      refreshToken
    }
  })
 
}catch(error){
  return response.status(500).json({
    message: error.message || error,
    error: true,
    success: false
  })
}
}

// logout controller
export async function logoutController(request, response) {
  try{
    const userid = request.userId  // auht middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    response.clearCookie("accessToken", cookiesOption)
    response.clearCookie("refreshToken", cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
      refresh_token : ""
    })

    return response.json({
      message: "Logout successfully",
      error: false,
      success: true
    })
  }catch(error){
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success: false
    })
  }
  
}

//image upload
let imagesArr = [];
export async function userAvatarController(request, response) {
   try
   {
     imagesArr = [];

     const userId = request.userId;  // auth middleware
     const image = request.files;

     const user = await UserModel.findOne({_id: userId});

     if(!user){
      return response.status(500),json({
        message: "user not Found",
        error: true,
        success: false
      })
     }


     // first remove image from cloudinary
     const imgUrl = user.avatar;

     const urlArr = imgUrl.split("/");
     const avatar_image = urlArr[urlArr.length - 1];
   
     const imageName = avatar_image.split(".")[0];
   
     if(imageName){
       const res = await cloudinary.uploader.destroy(
         imageName,
         (error, result)=> {
           // console.log(error, res)
         }
       );
   
    //    if(res) {
    //      response.status(200).send(res);
    //    }
    //  }

    //  if(!user){
    //   return response.status(500).json({
    //     message: "User not Found",
    //     error: true,
    //     success: false
      // })
     }

    
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
    
    user.avatar = imagesArr[0];
    await user.save();

     return response.status(200).json({
      _id: userId,
      avtar: imagesArr[0]
     });


   } catch (error){
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
      response.status(200).send(res);
    }
  }
  
}
//user update details
export async function updateUserDetalis(request, response) {
  try {
    const userId = request.userId //auth middleware
    const { name, email, mobile, password } = request.body;

    const userExist = await UserModel.findById(userId);
    if(!userExist)
      return response.status(400).send('this user cannot be updated!');


      const updateUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          name: name,
          mobile: mobile,
          email: email,
    
        },
        { new: true }
      )

    //  if(email !== userExist.email) {
    //    // send verification email 
    //    await sendEmailFun({
    //     to: email,
    //     subject: "verify email from Bigbag Online Store",
    //     text: "",
    //     html: VerificationEmail(name, verifyCode)
    //   })
    
    //  }
    
     return response.json({
      message: "User Updated Successfully",
      error: false,
      success: true,
      user: {
        name:updateUser?.name,
        _id:updateUser?._id,
        email:updateUser?.email,
        mobile:updateUser?.mobile,
        avatar:updateUser?.avatar
      }
     })
  } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
  } 
}

// forgot password
export async function forgotPasswordController(request, response) {
  try {
    const { phone } = request.body

    const user = await UserModel.findOne({phone:phone})

    if(!user){
      return response.status(400).json({
        message: "phone not Available",
        error: true,
        success: false
      })
    }

    else{
      let verifyCode = Math.floor(1000 +Math.random() * 9000).toString();

      user.otp = verifyCode;
      user.otpExpires = Date.now() + 600000;

      await user.save();
  
      await sendEmailFun({
        to: email,
        subject: "Forgot Password from Bigbag Online Store",
        text: "",
        html: VerificationEmail(user.name, verifyCode)
      })
  
      return response.json({
        message: "check Your Email",
        error: false,
        success: true
      })
    }

  

  } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
  }
}

export async function verifyForgotPasswordOtp(request, response) {
   try {
    const { email, otp } = request.body;

   const user = await UserModel.findOne({ email:email })

   if(!user){
    return response.status(400).json({
      message: "Email not Available",
      error: true,
      success: false
    })
   }

   if(!email || !otp) {
    return response.status(400).json({
      message:"Provide required field Email, OTP",
      error: true,
      success: false
    })
   }

   if(otp !== user.otp){
    return response.status(400).json({
      message: "Invalid OTP",
      error: true,
      success: false
    })
   }

   const currentTime = new Date().toISOString()

   if(user.otpExpires < currentTime){
    return response.status(400).json({
      message: "Otp is Expired",
      error: true,
      success: false
    })
   }

   user.otp = "";
   user.otpExpires = "";

   await user.save();

   return response.status(200).json({
    message: "OTP Verify Successfully",
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

//reset password
export async function resetPassword(request, response) {
  try {
    const { newPassword, confirmPassword } = request.body;
    if( !newPassword || !confirmPassword){
      return response.status(400).json({
        error: true,
        success:false,
        message: "All Fields Are Required"
      })
    }

    const user = await UserModel.findOne({phone})

    if(!user){
      return response.status(400).json({
        message: "Phone not Available",
        error: true,
        success: false
      })
    }

    if(user?.registerWithGoogle === false){
        const checkPassword = await bcryptjs.compare(oldPassword, user.password);
    if(!checkPassword){
      return response.status(400).json({
        message: "Your Password is Wrong Try Again",
        error: true,
        success:false
      })
    }
    }

   

    if(newPassword !== confirmPassword){
      return response.status(400).json({
        message: "newPassword and ConfirmPassword must be Same",
        error: true,
        success: false
      })
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(confirmPassword, salt);

  user.password = hashPassword;
  user.registerWithGoogle = false;
  await user.save();

    return response.json({
      message: "Password Updated Successfully.",
      success: true,
      error: false
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
    
  }
}

// refresh token

export async function refreshToken(request, response) {
  try {
    const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split("")[1] // [Bearer token]

    if(!refreshToken) {
      return response.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false
      })
    }


    const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

    if(!verifyToken){
      return response.status(401).json({
        message: "token is Expired",
        error: true,
        success: false
      })
    }

    const userId = verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    response.cookie('accessToken', newAccessToken, cookiesOption)
    
    return response.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accesstoken : newAccessToken
      }
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// get login user details
export async function userDetails(request, response) {
  try {
    const userId = request.userId

    const user  = await UserModel.findById(userId).select('-password -refresh_token').
    populate('address_details')

    return response.json({
      message: 'User Details',
      data: user,
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: "Something is Wrong",
      error: true,
      success: false
    })
  }
}

export async function addReview(request, response) {
  try {
    const{image, userName,review ,rating, userId, productId} = request.body;

    const userReview = new ReviewModel({
      image:image,
      userName:userName,
      review:review,
      rating:rating,
      userId:userId,
      productId:productId
    })

    await userReview.save();

    return response.json({
      message: 'Review Added Successfully',
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: "Something is Wrong",
      error: true,
      success: false
    })
  }
}

// get review

export async function getReview(request, response) {
  try {
    const productId = request.query.productId;

    const reviews =await ReviewModel.find({productId:productId});

    if(!reviews){
      return response.status(404).json({
        error: true,
        success:false,
        message:"Review not Found"
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      reviews:reviews
    })

  } catch (error) {
    return response.status(500).json({
      message: "Something is Wrong",
      error: true,
      success: false
    })
  }
}

export async function getAllReviews(request, response) {
  try {
    const reviews = await ReviewModel.find();

    if(!reviews){
      return response.status(404).json({
        error:true,
         success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      reviews:reviews
    })

  } catch (error) {
    return response.status(500).json({
      message: "Something is Wrong",
      error: true,
      success: false
    })
  }
}


export async function getAllUsers(request, response) {
  try {
    const users = await UserModel.find();

    if(!users){
      return response.status(404).json({
        error:true,
        success:false
      })
    }

    return response.status(200).json({
      error:false,
      success:true,
      users:users
    })
  } catch (error) {
    return response.status(500).json({
      message: "Something is Wrong",
      error: true,
      success: false
    })
  }
}


//delete multiple products
export async function deleteMultiple(request, response){
  const {ids} = request.body;

  if(!ids || !Array.isArray(ids)){
    return response.status(400).json({
      error: true,
      success:false,
      message:"Invalid Input"
    });
  }

//   for(let i=0; i<ids?.length; i++){
//     const user = await UserModel.findById(ids[i]);

//     const images = user.images;
    
//           let img="";
//            for(img of images){
//              const imgUrl = img;
//              const urlArr = imgUrl.split("/");
//              const image = urlArr[urlArr.length - 1];

//              const imageName = image.split(".")[0];

//              if(imageName){
//               cloudinary.uploader.destroy(imageName,(error,result )=>{
//                 // console.log(error, result)
//               })
//              }

//   if(imageName){
//     cloudinary.uploader.destroy(imageName, (error, result) => {

//     });
//   }
// }
    
//   }

  try {
    await UserModel.deleteMany({_id: {$in: ids}});

    return response.status(200).json({
      message: "User Deleted Successfully",
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
