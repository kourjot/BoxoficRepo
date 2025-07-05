
import { User } from "../model/user.js";

// Create TeamLead
 const createTeamLead = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      phoneNumber,
      role: "teamLead",
    });

    await newUser.save();
    res.status(201).json({ msg: "TeamLead created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Error creating TeamLead", error: err.message });
  }
};

// Get All TeamLeads
 const getAllTeamLeads = async (req, res) => {
  try {
    const teamLeads = await User.find({ role: "teamLead" });
    res.status(200).json({ teamLeads });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching teamLeads", error: err.message });
  }
};

// Update TeamLead
 const updateTeamLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ msg: "TeamLead updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Error updating teamLead", error: err.message });
  }
};

// Delete TeamLead
 const deleteTeamLead = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "TeamLead deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting teamLead", error: err.message });
  }
};


