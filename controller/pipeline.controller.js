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


const getAllPipelines= async (req, res, next) => {
  try {
    const userId = req.user.userId;
   console.log("User ID ", req.user.userId);
    // Get the pipeline created by this user
    let pipeline = await Pipeline.findOne({ createdBy: userId })
      .populate({
        path: "stages",
        populate: {
          path: "deals",
          match: { createdBy: userId }, // filter only user-created deals
        },
        options: { sort: { order: 1 } } // sort stages by order
      });
    console.log("Pipeline found: ", pipeline);
    // If no pipeline found, fallback to default
    if (!pipeline) {
      pipeline = await Pipeline.findOne({ isDefault: true })
        .populate({
          path: "stages",
          populate: {
            path: "deals",
            match: { createdBy: userId },
          },
          options: { sort: { order: 1 } }
        });

      if (!pipeline) {
        return res.status(404).json({
          status: false,
          message: "Default pipeline not found",
        });
      }
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: "Deals fetched successfully",
      data: {
        pipelineId: pipeline._id,
        stages: pipeline.stages,
      },
    });
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
