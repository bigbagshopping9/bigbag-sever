import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToMyListController, deleteToMyListController, getToMyListController } from "../controllers/mylist.controller.js";

const myListRouter = Router();

myListRouter.post("/add",auth,addToMyListController);
myListRouter.get("/",auth,getToMyListController);
myListRouter.delete("/:id",auth,deleteToMyListController);

export default myListRouter;