import { Deal } from "../model/deal.model.js";
import * as ERROR from "../common/error_message.js";
import { sendSuccess } from "../utils/responseHandler.js";

const createDeal = async (req, res, next) => {
  try {
    const {
      title,
      description,
      value,
      pipeline,
      stageId,
      stageName,
      code_currency,
      endDate
    } = req.body;

    const createdBy = req.user?.userId;

    // 🔍 Validation
    if (!title) throw new Error(ERROR.DEAL_TITLE_REQUIRED);
    if (!value) throw new Error(ERROR.DEAL_VALUE_REQUIRED);
    if (!pipeline) throw new Error(ERROR.PIPELINE_ID_REQUIRED);
    if (!stageId) throw new Error(ERROR.STAGE_ID_REQUIRED);
    if (!stageName) throw new Error(ERROR.STAGE_NAME_REQUIRED);
    if (!createdBy) throw new Error(ERROR.USER_ID_REQUIRED);

    const newDeal = new Deal({
      title,
      description,
      value,
      pipeline,
      stageId,
      stageName,
      createdBy,
      code_currency: code_currency || "INR",
      endDate
    });

    const savedDeal = await newDeal.save();

    return sendSuccess(res, "Deal created successfully", savedDeal, 201);
  } catch (err) {
    next(err);
  }
};

export { createDeal };
