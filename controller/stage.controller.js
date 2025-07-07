import { Stage } from "../model/stage.model.js";
import * as ERROR from "../common/error_message.js";
import { sendSuccess } from "../utils/responseHandler.js";

const createStage = async (req, res, next) => {
  try {
    const { name, order } = req.body;

    // Validation
    if (!name) throw new Error(ERROR.STAGE_NAME_REQUIRED);
    if (order === undefined) throw new Error(ERROR.STAGE_ORDER_REQUIRED);

    const stage = new Stage({
      name,
      order,
      createdBy: req.user.userId, // from auth token
    });

    const savedStage = await stage.save();

    return sendSuccess(res, "Stage created successfully", savedStage, 201);
  } catch (err) {
    next(err); // Global error handler
  }
};

const getAllStages = async (req, res, next) => {
  try {
    const stages = await Stage.find({ isDeleted: false }).sort({ order: 1 });
    // console.log(stages)
    //  Handle no stages found
    if (!stages || stages.length === 0) {
      throw new Error(ERROR.NO_STAGES_FOUND);
    }

    // Success response
    return sendSuccess(res, "Stages fetched successfully", { stages });
  } catch (err) {
    next(err); //  Forward to global error handler
  }
};


 const updateStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) throw new Error(ERROR.STAGE_ID_REQUIRED);
    if (!updates.name) throw new Error(ERROR.STAGE_NAME_REQUIRED);
    // if (typeof updates.order !== "number") throw new Error(ERROR.STAGE_ORDER_REQUIRED);

    const updatedStage = await Stage.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedStage) throw new Error(ERROR.STAGE_NOT_FOUND);

    return sendSuccess(res, "Stage updated successfully", updatedStage);
  } catch (err) {
    next(err);
  }
}

const deleteStage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
      throw new Error(ERROR.STAGE_ID_REQUIRED);
    }

    // Update isDeleted to true
    const deletedStage = await Stage.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedStage) {
      throw new Error(ERROR.STAGE_NOT_FOUND);
    }

    return sendSuccess(res, "Stage soft-deleted successfully", deletedStage);
  } catch (err) {
    next(err);
  }
};

export { createStage ,getAllStages ,updateStage ,deleteStage};
