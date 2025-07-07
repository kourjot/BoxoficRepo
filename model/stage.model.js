
import { Schema, model } from "mongoose";

const stageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true, // Used to maintain stage order in UI
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Who created this stage (optional, helpful for tracking)
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag
    },
  },
  { timestamps: true }
);

const Stage = model("Stage", stageSchema);
export { Stage };
