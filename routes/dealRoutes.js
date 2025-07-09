import  {Router} from "express";
import { createDeal ,getDealsByPipeline, updateDeal, deleteDeal } from "../controller/deals.controller.js";
import { tokenVerify  } from "../middleware/auth.js";

const dealRouter = Router();

dealRouter.post("/create-deal", tokenVerify , createDeal);

dealRouter.get("/get-deals/:pipelineId", tokenVerify, getDealsByPipeline);

dealRouter.patch("/update-deal/:id", tokenVerify, updateDeal);

dealRouter.delete("/delete-deal/:id", tokenVerify, deleteDeal);
export  {dealRouter}




 


