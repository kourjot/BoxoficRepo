import { User } from "../model/user.js";
import argon2  from "argon2"
//  Admin creates Manager
const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const hashedPassword = await argon2.hash(password);
    const newManager = new User({
      name,
      email,
      password: hashedPassword,
      role: "manager"
    });

    await newManager.save();
    res.status(201).json({ message: "Manager created", user: newManager });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });
    res.status(200).json({ managers });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching managers", error: err.message });
  }
};

 const updateManager = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "Manager updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating manager", error: err.message });
  }
};

 const deleteManager = async (req, res) => {
  try {
    const deleted = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json({ msg: "Manager soft-deleted", deleted });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting manager", error: err.message });
  }
};



export { createManager,getAllManagers ,updateManager ,deleteManager};
