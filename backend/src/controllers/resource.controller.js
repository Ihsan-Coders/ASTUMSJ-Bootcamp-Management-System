const Resource = require("../models/Resource");
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      uploadedBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, data: resource, message: "Resource added" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
const getResources = async (req, res) => {
  try {
    const { topic, search } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (search) filter.title = { $regex: search, $options: "i" };
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, data: resources, message: "Resources fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, data: null, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { createResource, getResources, deleteResource };
