import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { uploadImages, createProduct, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdSubCatId, getAllProductsByThirdSubCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsCount, getAllFeaturedProducts, deleteProduct, getProduct, removeImageFromCloudinary, updateProduct, deleteMultipleProduct, createProductRam, deleteProductRam, updateProductRam, deleteMultipleProductRam, getProductRam, getProductRamById, createProductSize, deleteProductSize, updateProductSize, deleteMultipleProductSize, getProductSize, getProductSizeById, createProductWeight, deleteProductWeight, updateProductWeight, deleteMultipleProductWeight, getProductWeight, getProductWeightById, uploadBannerImages, filters, sortBy, searchProductController, getDealsOfTheDay, getTopPicks, getFestivalGift } from "../controllers/product.controller.js";


const productRouter = Router();
productRouter.post('/uploadImages',auth,upload.array('images'), uploadImages);
productRouter.post('/uploadBannerImages',auth,upload.array('bannerimages'), uploadBannerImages);
productRouter.post('/create', createProduct);
productRouter.get('/getallproducts',getAllProducts);
productRouter.get('/getallproductsbyCatId/:id',getAllProductsByCatId);
productRouter.get('/getallproductsbyCatname',getAllProductsByCatName);
productRouter.get('/getallproductsbySubCatId/:id',getAllProductsBySubCatId);
productRouter.get('/getallproductsbySubCatname',getAllProductsBySubCatName);
productRouter.get('/getallproductsbyThirdSubCatId/:id',getAllProductsByThirdSubCatId);
productRouter.get('/getallproductsbyThirdSubCatname',getAllProductsByThirdSubCatName);
productRouter.get('/getallproductsbyPrice',getAllProductsByPrice);
productRouter.get('/getallproductsbyRating',getAllProductsByRating);
productRouter.get('/getallproductsCount',getAllProductsCount);
productRouter.get('/getallfeaturedproducts',getAllFeaturedProducts);
productRouter.get('/deals',getDealsOfTheDay);
productRouter.get('/top-picks',getTopPicks);
productRouter.get('/festival-gift',getFestivalGift);
productRouter.delete('/:id',deleteProduct);
productRouter.delete('/deleteMultiple',deleteMultipleProduct)
productRouter.get('/:id',getProduct);
productRouter.delete('/deleteImage',auth,removeImageFromCloudinary);
productRouter.put('/updateproduct/:id',auth,updateProduct);
productRouter.post('/filters',filters);
productRouter.post('/sortBy',sortBy);
productRouter.post('/search/get',searchProductController);

// productRouter.post('/productRams/create', createProductRam);
// productRouter.delete('/productRams/:id', deleteProductRam);
// productRouter.put('/productRams/:id', auth, updateProductRam);
// productRouter.delete('/productRams/deleteMultipleRams', auth, deleteMultipleProductRam);
// productRouter.get('/productRams/get', auth, getProductRam);
// productRouter.get('/productRams/:id', auth, getProductRamById);

// productRouter.post('/productSize/create', auth, createProductSize);
// productRouter.delete('/productSize/:id', deleteProductSize);
// productRouter.put('/productSize/:id', auth, updateProductSize);
// productRouter.delete('/productSize/deleteMultipleSize', auth, deleteMultipleProductSize);
// productRouter.get('/productSize/get', auth, getProductSize);
// productRouter.get('/productSize/:id', auth, getProductSizeById);

// productRouter.post('/productWeight/create', auth, createProductWeight);
// productRouter.delete('/productWeight/:id', deleteProductWeight);
// productRouter.put('/productWeight/:id', auth, updateProductWeight);
// productRouter.delete('/productWeight/deleteMultipleWeight', auth, deleteMultipleProductWeight);
// productRouter.get('/productWeight/get', auth, getProductWeight);
// productRouter.get('/productWeight/:id', auth, getProductWeightById);


export default productRouter;