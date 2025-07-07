
import { User } from "../model/user.js";

import * as ERROR from "../common/error_message.js";
import { sendSuccess } from "../utils/responseHandler.js";

import argon2  from "argon2"
// Create TeamLead
 const createTeamLead = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //  Required fields validation
    if (!name) throw new Error(ERROR.NAME);
    if (!email) throw new Error(ERROR.EMAIL);
    if (!password) throw new Error(ERROR.PASSWORD);

    //  Check if user with email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error(ERROR.ACCOUNT_ALREADY_EXISTS);

    //  Hash password (optional if not already hashed before saving)
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "teamLead",
    });

    await newUser.save();

    //  Return success response
    return sendSuccess(res, "TeamLead created successfully", {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }, 201);

  } catch (err) {
    next(err); //  send to global error handler
  }
};

// Get All TeamLeads
const getAllTeamLeads = async (req, res, next) => {
  try {
    const teamLeads = await User.find({ role: "teamLead", isDeleted: false });

    if (!teamLeads.length) {
      throw new Error(ERROR.NO_TEAMLEADS_FOUND);
    }

    return sendSuccess(res, "TeamLeads fetched successfully", { teamLeads });
  } catch (err) {
    next(err); // Forward to global error handler
  }
};

// Update TeamLead
const updateTeamLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      throw new Error(ERROR.DATA_NOT_FOUND); 
    }

    return sendSuccess(res, "TeamLead updated successfully", { user: updatedUser });
  } catch (err) {
    next(err); // Forward error to global error handler
  }
};

// Delete TeamLead
const deleteTeamLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedUser) {
      throw new Error(ERROR.DATA_NOT_FOUND); 
    }

    return sendSuccess(res, "TeamLead soft-deleted successfully", deletedUser);
  } catch (err) {
    next(err); // Pass error to global handler
  }
};

export {
  createTeamLead,
  getAllTeamLeads,
  updateTeamLead,
  deleteTeamLead
};

