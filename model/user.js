import {Schema,model} from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // usually emails are unique
  },
  password: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
   default: null,
  },
  role: {
    type: String,
    default: "user",  // default role is user
  },
  isOrganization: {
    type: Number,
    default: 0, // 0 = no organization created, 1 = organization created
  },
}, { timestamps: true });

// Create the model
const User =model("User", userSchema);

export {User}


