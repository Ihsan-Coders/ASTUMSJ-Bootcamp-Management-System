const { calculateLeaderboard } = require('../services/leaderboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getLeaderboard = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const leaderboard = await calculateLeaderboard(batchId);
    res.status(200).json({ success: true, data: leaderboard, message: 'Leaderboard fetched' });
})

module.exports = { getLeaderboard };
