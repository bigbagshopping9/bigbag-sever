import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createHomeSlide, deleteMultipleSlide, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, updateSlide, uploadImages } from "../controllers/homeSlider.controller.js";


const homeSlidesRouter = Router();

homeSlidesRouter.post('/uploadImages',auth,upload.array('images'), uploadImages)
homeSlidesRouter.post('/create',  createHomeSlide);
homeSlidesRouter.get('/',getHomeSlides)
homeSlidesRouter.get('/:id',getSlide)
homeSlidesRouter.delete('/deleteImage',auth,removeImageFromCloudinary)
homeSlidesRouter.delete('/:id',deleteSlide)
homeSlidesRouter.delete('/:id',deleteMultipleSlide)
homeSlidesRouter.put('/:id',auth,updateSlide)

export default homeSlidesRouter;
