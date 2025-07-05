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
  isValidated: {
    type: Boolean,
    default: false
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
    enum: ["admin", "manager", "teamLead"],
    default: "teamLead",  // default role is teamLead
  },
  isOrganization: {
    type: Number,
    default: 0, // 0 = no organization created, 1 = organization created
  },
  isDeleted: {
  type: Boolean,
  default: false,
  },
  socialId: {
        type: String, // Google `sub` ID
      },
   picture: {
      type: String, // Google profile image URL
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },

}, { timestamps: true });

// Create the model
const User =model("User", userSchema);

export {User}


