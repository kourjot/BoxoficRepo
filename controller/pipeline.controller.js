import {Pipeline } from "../model/pipeline.model.js";
import {Stage} from "../model/stage.model.js";
import * as ERROR from "../common/error_message.js";
import { sendSuccess } from "../utils/responseHandler.js";
   
const createPipeline = async (req, res, next) => {
  try {
    const { name, stages } = req.body;

    // Validation
    if (!name) throw new Error(ERROR.PIPELINE_NAME_REQUIRED);
    if (!Array.isArray(stages)) throw new Error(ERROR.PIPELINE_STAGES_REQUIRED);

    const pipeline = new Pipeline({
      name,
      stages,
      createdBy: req.user.userId, 
    });

    const savedPipeline = await pipeline.save();

    return sendSuccess(res, "Pipeline created successfully", savedPipeline, 201);
  } catch (err) {
    next(err);
  }
};

const getAllPipelines = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const pipelines = await Pipeline.find({ createdBy: userId })
      .populate("stages") // optional: returns full stage info
      .sort({ createdAt: -1 });

    const message =
      pipelines.length === 0
        ? "No pipelines found for this user"
        : "Pipelines fetched successfully";

    return sendSuccess(res, message, { pipelines });
  } catch (err) {
    next(err);
  }
};


const upsertStageToPipeline = async (req, res, next) => {
  try {
    const pipelineId = req.params.id;
    const { stageId } = req.body;

    if (!pipelineId) throw new Error(ERROR.PIPELINE_ID_REQUIRED);
    if (!stageId) throw new Error(ERROR.STAGE_ID_REQUIRED);

    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) throw new Error(ERROR.PIPELINE_NOT_FOUND);

    let message = "";

    const existingIndex = pipeline.stages.findIndex(
      (stage) => stage.toString() === stageId
    );

    if (existingIndex !== -1) {
      // Already exists → update (or replace)
      pipeline.stages[existingIndex] = stageId;
      message = "Stage updated successfully in pipeline";
    } else {
      // Doesn't exist → add
      pipeline.stages.push(stageId);
      message = "Stage added to pipeline successfully";
    }

    const updatedPipeline = await pipeline.save();

    return sendSuccess(res, message, updatedPipeline);
  } catch (err) {
    next(err);
  }
};

const removeStageFromPipeline = async (req, res, next) => {
  try {
    const pipelineId = req.params.id;
    const { stageId } = req.body;

    if (!pipelineId) throw new Error(ERROR.PIPELINE_ID_REQUIRED);
    if (!stageId) throw new Error(ERROR.STAGE_ID_REQUIRED);

    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) throw new Error(ERROR.PIPELINE_NOT_FOUND);

    const index = pipeline.stages.findIndex(
      (stage) => stage.toString() === stageId
    );

    if (index === -1) {
      throw new Error(ERROR.STAGE_NOT_IN_PIPELINE);
    }

    // Remove stage
    pipeline.stages.splice(index, 1);
    const updatedPipeline = await pipeline.save();

    return sendSuccess(res, "Stage removed from pipeline successfully", updatedPipeline);
  } catch (err) {
    next(err);
  }
};



export {createPipeline,getAllPipelines,upsertStageToPipeline,removeStageFromPipeline };
