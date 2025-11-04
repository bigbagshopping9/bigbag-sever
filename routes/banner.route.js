import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addBanner, deleteBanner, getBanner, getBanners, updateBanner, uploadImages } from "../controllers/banner.controller.js";
import { removeImageFromCloudinary } from "../controllers/category.controller.js";

const bannerRouter = Router();
bannerRouter.post('/uploadImages',auth,upload.array('images'), uploadImages)
bannerRouter.post('/add', addBanner)
bannerRouter.get('/', getBanners)
bannerRouter.get('/:id',getBanner)
bannerRouter.delete('/deleteImage',auth,removeImageFromCloudinary)
bannerRouter.delete('/:id',auth,deleteBanner)
bannerRouter.put('/:id',auth,updateBanner)

export default bannerRouter;