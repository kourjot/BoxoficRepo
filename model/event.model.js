import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // Admin or Manager
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Event = model("Event", eventSchema);
export { Event };
