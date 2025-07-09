import { Schema, model } from "mongoose";

const pipelineSchema = new Schema(
  {
    name: {
      type: String,
      default: "Default Pipeline",
    },

    stages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Stage", // Refers to stages collection
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Who created the pipeline
      required: true,
      default: null, 
    },
  },
  { timestamps: true }
);

const Pipeline = model("Pipeline", pipelineSchema);
export { Pipeline };
