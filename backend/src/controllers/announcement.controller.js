const Announcement = require("../models/Announcement");

// Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Get published announcements
const getAnnouncements = async (req, res) => {
  try {
    const { batchId } = req.query;

    const filter = {
      publishDate: { $lte: new Date() },
    };

    if (batchId) {
      filter.$or = [{ batch: batchId }, { targetAudience: "All" }];
    }

    const announcements = await Announcement.find(filter).sort({
      publishDate: -1,
    });

    res.status(200).json({
      success: true,
      data: announcements,
      message: "Announcements fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Update an announcement
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Announcement deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
