const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return 0;
  }

  const applicableRecords = attendanceRecords.filter((record) =>
    ["Present", "Absent", "Late"].includes(record.status),
  );

  if (applicableRecords.length === 0) {
    return 0;
  }

  const attendedRecords = applicableRecords.filter(
    (record) =>
      record.status === "Present" || record.status === "Late",
  );

  return Math.round(
    (attendedRecords.length / applicableRecords.length) * 100,
  );
};

const isAtRisk = (percentage) => percentage < 75;

module.exports = {
  calculateAttendancePercentage,
  isAtRisk,
};
