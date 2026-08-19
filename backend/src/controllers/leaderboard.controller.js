const { calculateLeaderboard } = require('../services/leaderboard.service');

const getLeaderboard = async (req, res) => {
  try {
    const { batchId } = req.query;
    const leaderboard = await calculateLeaderboard(batchId);
    res.status(200).json({ success: true, data: leaderboard, message: 'Leaderboard fetched' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { getLeaderboard };
