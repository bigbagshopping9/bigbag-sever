import { Router } from "express";
import {addReview, authWithGoogle, deleteMultiple, forgotPasswordController, getAllReviews, getAllUsers, getReview, loginUserController, logoutController, refreshToken, registerUserController, removeImageFromCloudinary, resetPassword, updateUserDetalis, userAvatarController, userDetails, verifyForgotPasswordOtp} from '../controllers/user.controller.js';
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router()
userRouter.post('/register',registerUserController)
// userRouter.post('/verify-otp',verifyOtpController)
userRouter.post('/login',loginUserController)
userRouter.post('/authWithGoogle',authWithGoogle)
userRouter.get('/logout', auth,logoutController)
userRouter.put('/user-avatar', auth,upload.array('avatar'), userAvatarController)
userRouter.delete('/deleteimage',auth,removeImageFromCloudinary)
userRouter.put('/:id',auth, updateUserDetalis)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)
userRouter.post('/addReview', addReview)
userRouter.get('/getReviews', getReview)
userRouter.get('/getAllReviews', getAllReviews)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.delete('/deleteMultiple',deleteMultiple)



export default userRouter;