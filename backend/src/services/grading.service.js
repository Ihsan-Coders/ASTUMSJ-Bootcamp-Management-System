const validateScore = (score, maxScore) => {
  if (
    typeof score !== "number" ||
    Number.isNaN(score) ||
    score < 0 ||
    score > maxScore
  ) {
    const error = new Error(
      `Score must be between 0 and ${maxScore}`
    );

    error.statusCode = 400;

    throw error;
  }

  return true;
};

const determineGradeLabel = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 50) return "Satisfactory";
  return "Needs Improvement";
};

module.exports = {
  validateScore,
  determineGradeLabel,
};