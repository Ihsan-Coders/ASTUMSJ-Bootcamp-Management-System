const express = require('express');

const router = express.Router();

const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { createEventSchema, updateEventSchema } = require('../validators/calendar.validator');

const {
  createEvent, getEvents, updateEvent, deleteEvent,
} = require('../controllers/calendar.controller');

router.use(protect);
router.get('/', authorize('admin', 'mentor', 'student'), getEvents);
router.post('/', authorize('admin', 'mentor'), validate(createEventSchema), createEvent);
router.put('/:id', authorize('admin', 'mentor'), validate(updateEventSchema), updateEvent);
router.delete('/:id', authorize('admin', 'mentor'), deleteEvent);

module.exports = router;
