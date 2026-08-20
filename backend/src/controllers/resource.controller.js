const Resource = require("../models/Resource");
const asyncHandler = require('../utils/asyncHandler');

const createResource = asyncHandler(async (req, res) => {
    const resource = await Resource.create({
      ...req.body,
      uploadedBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, data: resource, message: "Resource added" });
  
})

const getResources = asyncHandler(async (req, res) => {
    const { topic, search } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (search) filter.title = { $regex: search, $options: "i" };
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, data: resources, message: "Resources fetched" });
  
})

const deleteResource = asyncHandler(async (req, res) => {
    await Resource.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, data: null, message: "Resource deleted" });
})

module.exports = { createResource, getResources, deleteResource };
