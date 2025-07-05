import { Event } from "../model/event.model.js";

// ✅ Create Event
 const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      createdBy: req.user.userId, // comes from token
    });

    await newEvent.save();

    res.status(201).json({ msg: "Event created", event: newEvent });
  } catch (err) {
    res.status(500).json({ msg: "Error creating event", error: err.message });
  }
};

// ✅ Get All Events
 const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false }).populate("createdBy", "name email role");
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching events", error: err.message });
  }
};

// ✅ Get Event By ID
 const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.status(200).json({ event });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching event", error: err.message });
  }
};

// ✅ Update Event
 const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ msg: "Event updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating event", error: err.message });
  }
};

// ✅ Soft Delete Event
 const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json({ msg: "Event soft-deleted", deleted });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting event", error: err.message });
  }
};


export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };