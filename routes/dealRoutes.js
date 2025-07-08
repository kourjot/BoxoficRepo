import  {Router} from "express";
import { createDeal } from "../controller/deals.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const dealRouter = Router();

dealRouter.post("/create-deal", authMiddleware, createDeal);

export  {dealRouter}
