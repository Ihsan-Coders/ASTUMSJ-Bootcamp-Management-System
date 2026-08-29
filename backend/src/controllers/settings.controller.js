const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

// Helper to fetch the single global setting document, creating a default
// one if missing.
const getOrCreateSetting = async () => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }
  return setting;
};

// GET /api/settings/registration
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const setting = await getOrCreateSetting();
  res.status(200).json({ success: true, data: { registrationOpen: setting.registrationOpen }, message: 'Registration status fetched' });
});

// PUT /api/settings/registration
const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { registrationOpen } = req.body;

  if (typeof registrationOpen !== 'boolean') {
    return res.status(400).json({ success: false, data: null, message: 'registrationOpen must be a boolean' });
  }

  const setting = await getOrCreateSetting();
  setting.registrationOpen = registrationOpen;
  await setting.save();

  res.status(200).json({ success: true, data: { registrationOpen: setting.registrationOpen }, message: 'Registration status updated' });
});

module.exports = {
  getRegistrationStatus,
  updateRegistrationStatus,
};
