const { calculateLeaderboard } = require("../services/leaderboard.service");
const asyncHandler = require("../utils/asyncHandler");

const getLeaderboard = asyncHandler(async (req, res) => {
  const { batchId } = req.query;

  const leaderboard = await calculateLeaderboard(req.user, batchId);

  res.status(200).json({
    success: true,

    data: {
      leaderboard,

      scoring: {
        defined: false,
        message:
          "The SRS does not define an overall weighting formula. Raw performance metrics are provided without artificial scoring.",
      },
    },

    message: "Overall bootcamp leaderboard fetched",
  });
});

module.exports = {
  getLeaderboard,
};
