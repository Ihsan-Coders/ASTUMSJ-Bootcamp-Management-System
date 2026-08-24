const User = require('../models/User');
const Batch = require('../models/Batch');

/**
 * Build the MongoDB filter that determines which announcements a given
 * user is allowed to see.
 *
 * - Admin / mentor: management view. They see every announcement
 *   (including ones scheduled for the future) so they can manage the
 *   full list.
 * - Student: recipient view. They only see announcements that are
 *   already published (publishDate <= now) and whose audience actually
 *   includes them: "All", "Students", or "SpecificBatch" matching the
 *   batch they belong to (User.batch).
 */
const getVisibleAnnouncementsFilter = async (user) => {
  if (!user) return { _id: null }; // no user, no announcements

  if (user.role === 'admin' || user.role === 'mentor') {
    return {};
  }

  const audienceConditions = [
    { targetAudience: 'All' },
    { targetAudience: 'Students' },
  ];

  const student = await User.findById(user.id).select('batch');

  if (student?.batch) {
    audienceConditions.push({
      targetAudience: 'SpecificBatch',
      batch: student.batch,
    });
  }

  return {
    publishDate: { $lte: new Date() },
    $or: audienceConditions,
  };
};

/**
 * Resolve which user IDs should be notified when a new announcement is
 * published, based on its targetAudience. Mirrors the audience segments
 * defined on the Announcement model itself (students / mentors, not
 * other admins — admins are the ones publishing, not a notification
 * audience segment).
 */
const getAnnouncementRecipientIds = async (announcement) => {
  let studentIds = [];
  let mentorIds = [];

  if (announcement.targetAudience === 'Students') {
    const students = await User.find({ role: 'student' }).select('_id');
    studentIds = students.map((u) => u._id);
  } else if (announcement.targetAudience === 'Mentors') {
    const mentors = await User.find({ role: 'mentor' }).select('_id');
    mentorIds = mentors.map((u) => u._id);
  } else if (announcement.targetAudience === 'SpecificBatch' && announcement.batch) {
    const [students, batch] = await Promise.all([
      User.find({ role: 'student', batch: announcement.batch }).select('_id'),
      Batch.findById(announcement.batch).select('mentors'),
    ]);
    studentIds = students.map((u) => u._id);
    mentorIds = batch?.mentors || [];
  } else {
    // "All"
    const users = await User.find({ role: { $in: ['student', 'mentor'] } }).select('_id');
    studentIds = users.map((u) => u._id);
  }

  return [...new Set([...studentIds, ...mentorIds].map((id) => String(id)))];
};

module.exports = { getVisibleAnnouncementsFilter, getAnnouncementRecipientIds };
