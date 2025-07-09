import { Deal } from "../model/deal.model.js";
import { Stage } from "../model/stage.model.js";
import { Pipeline } from "../model/pipeline.model.js";
import * as ERROR from "../common/error_message.js";
import { sendSuccess } from "../utils/responseHandler.js";

const createDeal = async (req, res, next) => {
  try {
    const {
      title,
      description,
      value,
      stageId,
      code_currency,
      endDate,
    } = req.body;

    const createdBy = req.user?.userId;

    //  Basic validation
    if (!title) throw new Error(ERROR.DEAL_TITLE_REQUIRED);
    if (!value) throw new Error(ERROR.DEAL_VALUE_REQUIRED);
    if (!stageId) throw new Error(ERROR.STAGE_ID_REQUIRED);

    if (!createdBy) throw new Error(ERROR.USER_ID_REQUIRED);

    //  Get pipeline using stageId
    const pipeline = await Pipeline.findOne({ stages: stageId });
    if (!pipeline) throw new Error(ERROR.PIPELINE_NOT_FOUND);

    //  Create new deal
    const newDeal = new Deal({
      title,
      description,
      value,
      stageId,
      pipeline: pipeline._id,         // Automatically added
      createdBy,
      code_currency: code_currency || "INR",
      endDate,
    });

    const savedDeal = await newDeal.save();

    return sendSuccess(res, "Deal created successfully", savedDeal, 201);
  } catch (err) {
    next(err);
  }
};
const getDealsByPipeline = async (req, res, next) => {
  try {
    const { pipelineId } = req.params;

    if (!pipelineId) throw new Error(ERROR.PIPELINE_ID_REQUIRED);

    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) throw new Error(ERROR.PIPELINE_NOT_FOUND);

    // Fetch all stages in this pipeline
    const stages = await Stage.find({
      _id: { $in: pipeline.stages },
      isDeleted: false,
    }).sort({ order: 1 });

    // Attach deals to each stage
    const stageWithDeals = await Promise.all(
      stages.map(async (stage) => {
        const deals = await Deal.find({
          stageId: stage._id,
          isDeleted: false,
        });

        return {
          _id: stage._id,
          name: stage.name,
          order: stage.order,
          deals,
        };
      })
    );

    return sendSuccess(res, "Deals fetched successfully", {
      pipelineId,
      stages: stageWithDeals,
    });
  } catch (err) {
    next(err);
  }
};

const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //  Check required fields
    if (!id) throw new Error(ERROR.DEAL_ID_REQUIRED);

    //  Optional: Validate stageId and get pipeline again if stage changed
    if (updates.stageId) {
      const pipeline = await Pipeline.findOne({ stages: updates.stageId });
      if (!pipeline) throw new Error(ERROR.PIPELINE_NOT_FOUND);
      updates.pipeline = pipeline._id; // auto-update pipeline
    }

    const updatedDeal = await Deal.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDeal) throw new Error(ERROR.DEAL_NOT_FOUND);

    return sendSuccess(res, "Deal updated successfully", updatedDeal);
  } catch (err) {
    next(err);
  }
};

const deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error(ERROR.DEAL_ID_REQUIRED);

    const deletedDeal = await Deal.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedDeal) throw new Error(ERROR.DEAL_NOT_FOUND);

    return sendSuccess(res, "Deal soft-deleted successfully", deletedDeal);
  } catch (err) {
    next(err);
  }
};

export { createDeal ,getDealsByPipeline , updateDeal ,deleteDeal };
