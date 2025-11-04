// import mongoose from "mongoose";

// const otpSchema = mongoose.Schema({
//   phone : {
//     type : String,
//     required : true,
//   },
//   otpHash:{
//     type:String,
//     required:true,
//   },
//   expiresAt:{
//     type:Date,
//     required:true
//   },
//   attempts:{
//     type:Number,
//     default:0
//   },

//   createdAt:{
//     type:Date,
//     default:Date.now
//   }
// });

// otpSchema.index({phone: 1}); // index for loop

// const OtpModel = mongoose.model("Otp", otpSchema)

// export default otpSchema;

