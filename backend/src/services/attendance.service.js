const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;
  const applicableStatuses = ['Present', 'Absent', 'Late']; // Excused typically doesn't count against total
  const applicableRecords = attendanceRecords.filter((r) => applicableStatuses.includes(r.status));
  const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;

  if (applicableRecords.length === 0) return 0;

  return Math.round((presentCount / applicableRecords.length) * 100);
};

module.exports = { calculateAttendancePercentage };
