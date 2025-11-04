import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createSubCategory, deleteSubCategory, getSubCategories, getSubCategoriesCount, getSubCategory, updateSubCategory } from "../controllers/subCategory.controller.js";



const subCategoryRouter = Router();
subCategoryRouter.post('/create', createSubCategory)
subCategoryRouter.get('/', getSubCategories)
subCategoryRouter.get('/get/count',getSubCategoriesCount)
subCategoryRouter.get('/get/count/subcat',getSubCategoriesCount)
subCategoryRouter.get('/:id',getSubCategory)
subCategoryRouter.delete('/:id',auth,deleteSubCategory)
subCategoryRouter.put('/:id',auth,updateSubCategory)

export default subCategoryRouter;