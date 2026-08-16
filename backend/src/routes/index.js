const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const attendance=require('./attendance.routes');
const calendar=require('./calendar.routes')

router.use('/auth', authRoutes);
router.use('/attendance',attendance);
router.use('/calendar',calendar);

module.exports = router;
