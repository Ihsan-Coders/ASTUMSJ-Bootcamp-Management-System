const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { getLeaderboard } = require('../controllers/leaderboard.controller');

router.use(protect);
router.get('/', getLeaderboard);

module.exports = router;
