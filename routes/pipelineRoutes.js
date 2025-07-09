import {Router} from "express"
const pipelineRouter = Router()

import {createPipeline,getAllPipelines,upsertStageToPipeline,removeStageFromPipeline} from "../controller/pipeline.controller.js"

import { tokenVerify} from "../middleware/auth.js"; 




pipelineRouter.post("/create-pipeline",tokenVerify, createPipeline)

pipelineRouter.get("/get-pipeline", tokenVerify, getAllPipelines)

pipelineRouter.patch("/update-stage/:id", tokenVerify, upsertStageToPipeline)

pipelineRouter.patch("/remove-stage/:id", tokenVerify, removeStageFromPipeline)

export {pipelineRouter}