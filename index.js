import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import myListRouter from './routes/mylist.route.js';
import addressRouter from './routes/address.route.js';
import homeSlidesRouter from './routes/homeSlides.route.js';
import subCategoryRouter from './routes/subCategory.route.js';
import bannerRouter from './routes/banner.route.js';
import orderRouter from './routes/order.route.js';

const app = express();
app.use(cors({
  origin:["https://bigbag-shopping.netlify.app",// fronted link
          "https://bigbag-admin.netlify.app",//admin link
        
  ],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
          crossOriginResourcePolicy : false
}));

app.get("/", (request, response) =>{
  ///server to Client
    response.json({
      message : 'sesrver is runing' + process.env.PORT
    })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subCategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/myList', myListRouter)
app.use('/api/address', addressRouter)
app.use('/api/homeSlides', homeSlidesRouter)
app.use('/api/banner', bannerRouter)
app.use('/api/order', orderRouter)


connectDB().then(()=>{
  app.listen(process.env.PORT, ()=>{
    console.log("server is running", process.env.PORT)
  })
})

