const Resource = require("../models/Resource");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../services/upload.service");
const asyncHandler = require("../utils/asyncHandler");

const createResource = asyncHandler(async (req, res) => {
  const { title, description, type, topic, url, batch } = req.body;

  const file = req.files?.file?.[0] || null;
  const thumbnail = req.files?.thumbnail?.[0] || null;

  let resourceUrl = url || "";
  let fileName = null;
  let fileSize = null;
  let mimeType = null;
  let cloudinaryPublicId = null;
  let thumbnailUrl = null;
  let thumbnailPublicId = null;


  if (type === "Document") {
    if (!file) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "A file is required for Document resources",
      });
    }

    const result = await uploadToCloudinary(file, "astumsj-resources");

    resourceUrl = result.secure_url;
    fileName = file.originalname;
    fileSize = file.size;
    mimeType = file.mimetype;
    cloudinaryPublicId = result.public_id;
  } else if (!resourceUrl) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "A URL is required for Link and Video resources",
    });
  }

   // Thumbnail is optional and independent of resource type — a Link or
  // Video resource can have one just as much as a Document can.
  if (thumbnail) {
    const thumbResult = await uploadToCloudinary(thumbnail, "astumsj-resource-thumbnails");
    thumbnailUrl = thumbResult.secure_url;
    thumbnailPublicId = thumbResult.public_id;
  } 

  const resource = await Resource.create({
    title,
    description,
    type,
    topic,
    url: resourceUrl,
    batch: batch || null,
    uploadedBy: req.user.id,
    fileName,
    fileSize,
    mimeType,
    cloudinaryPublicId,
    thumbnailUrl,
    thumbnailPublicId,
  });

  res
    .status(201)
    .json({ success: true, data: resource, message: "Resource added" });
});

const getResources = asyncHandler(async (req, res) => {
  const { topic, type, search } = req.query;
  const filter = {};

  if (topic) filter.topic = topic;
  if (type) filter.type = type;
  if (search) filter.title = { $regex: search, $options: "i" };

  // Students only see resources open to everyone (no batch restriction)
  // plus resources restricted to their own batch. Admins and mentors can
  // see every resource regardless of batch.
  if (req.user.role === "student") {
    const student = await User.findById(req.user.id).select("batch");
    const batchIds = [null];
    if (student?.batch) batchIds.push(student.batch);
    filter.batch = { $in: batchIds };
  }

  const resources = await Resource.find(filter)
    .populate("uploadedBy", "name role")
    .populate("batch", "name")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, data: resources, message: "Resources fetched" });
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return res
      .status(404)
      .json({ success: false, data: null, message: "Resource not found" });
  }

  // Mentors may only delete resources they uploaded themselves; admins can
  // delete any resource.
  if (
    req.user.role === "mentor" &&
    resource.uploadedBy.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "You can only delete resources you uploaded",
    });
  }

  if (resource.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(resource.cloudinaryPublicId, {
        resource_type: "auto",
      });
    } catch (err) {
      // Non-fatal: still remove the database record even if the remote
      // file cleanup fails (e.g. already removed).
      console.error("Cloudinary cleanup failed:", err.message);
    }
  }

 if (resource.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(resource.thumbnailPublicId, {
        resource_type: "image",
      });
    } catch (err) {
      console.error("Cloudinary thumbnail cleanup failed:", err.message);
    }
  }
    
  await resource.deleteOne();

  res
    .status(200)
    .json({ success: true, data: null, message: "Resource deleted" });
});

module.exports = { createResource, getResources, deleteResource };
