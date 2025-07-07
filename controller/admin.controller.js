import { User } from "../model/user.js";
import argon2  from "argon2"

import * as ERROR from "../common/error_message.js";

import { sendSuccess} from "../utils/responseHandler.js";
//  Admin creates Manager


const createManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name) throw new Error(ERROR.NAME);
    if (!email) throw new Error(ERROR.EMAIL);
    if (!password) throw new Error(ERROR.PASSWORD);

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) throw new Error(ERROR.ACCOUNT_ALREADY_EXISTS);

    //  Hash password
    const hashedPassword = await argon2.hash(password);

    //  Create new manager
    const newManager = new User({
      name,
      email,
      password: hashedPassword,
      role: "manager",
    });

    await newManager.save();

    return sendSuccess(res, "Manager created successfully", {
      user: {
        name: newManager.name,
        email: newManager.email,
        role: newManager.role,
        _id: newManager._id,
      },
    });
  } catch (err) {
    next(err); // Send to global error handler
  }
};



const getAllManagers = async (req, res, next) => {
  try {
    const managers = await User.find({ role: "manager" });

    // Optional: if no managers found
    if (managers.length === 0) {
      throw new Error(ERROR.NO_MANAGERS_FOUND);
    }

     return sendSuccess(res, "Managers fetched successfully", { managers });
  } catch (err) {
    next(err); // send to global error handler
  }
};
const updateManager = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    //  Check if manager exists
    if (!updated) {
      throw new Error(ERROR.DATA_NOT_FOUND); // Or: ERROR.MANAGER_NOT_FOUND
    }

    //  Send proper success response
    return sendSuccess(res, "Manager updated successfully", {
      updated,
    });

  } catch (err) {
    next(err); //  Forward error to global error handler
  }
};
const deleteManager = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) {
      return sendError(res, "200::404::Manager not found", 404);
    }

    return sendSuccess(res, "Manager soft-deleted successfully", deleted);
  } catch (err) {
    next(err); // global error handler will handle it
  }
};


export { createManager,getAllManagers ,updateManager ,deleteManager};
