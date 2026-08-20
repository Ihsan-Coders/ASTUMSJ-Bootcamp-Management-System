const Announcement = require("../models/Announcement");
const asyncHandler = require('../utils/asyncHandler');
// Create a new announcement
const createAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created",
    });
  
} )

// Get published announcements
const getAnnouncements = asyncHandler ( async (req, res) => {
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
  
})

// Update an announcement
const updateAnnouncement = asyncHandler( async (req, res) => {
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
})

// Delete an announcement
const deleteAnnouncement = asyncHandler(async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Announcement deleted",
    });
})
module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
