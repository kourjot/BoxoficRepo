import express from "express";
import { createStage ,getAllStages,updateStage,deleteStage} from "../controller/stage.controller.js";
import { tokenVerify } from "../middleware/auth.js";

const stageRouter = express.Router();

stageRouter.post("/create-stage", tokenVerify, createStage);

stageRouter.get("/stages", tokenVerify, getAllStages);

stageRouter.patch("/update-stage/:id", tokenVerify, updateStage);

stageRouter.delete("/delete-stage/:id", tokenVerify, deleteStage);
export {stageRouter}