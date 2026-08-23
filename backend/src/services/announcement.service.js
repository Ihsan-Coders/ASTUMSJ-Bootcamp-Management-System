const User = require('../models/User');

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

module.exports = { getVisibleAnnouncementsFilter };
