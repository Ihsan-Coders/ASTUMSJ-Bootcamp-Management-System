const axios = require("axios");

const CF_BASE_URL = "https://codeforces.com/api";

/**
 * Checks whether a Codeforces handle actually exists.
 */
const validateHandle = async (handle) => {
  if (!handle || !handle.trim()) {
    return { valid: false, reason: "NoHandle" };
  }

  try {
    const res = await axios.get(`${CF_BASE_URL}/user.info`, {
      params: { handles: handle },
      timeout: 8000,
    });

    if (res.data.status === "OK" && res.data.result.length > 0) {
      return {
        valid: true,
        data: res.data.result[0],
      };
    }

    return {
      valid: false,
      reason: "InvalidHandle",
    };
  } catch (err) {
    if (err.response?.status === 400) {
      return {
        valid: false,
        reason: "InvalidHandle",
      };
    }

    console.error("Codeforces API error (validateHandle):", err.message);

    return {
      valid: false,
      reason: "ApiUnavailable",
    };
  }
};

/**
 * Fetches the public standings for a Codeforces contest.
 *
 * NOTE:
 * Codeforces may not return every participant in the public standings
 * response. Therefore, this function should NOT be used alone to determine
 * whether a particular student participated.
 */
const fetchContestStandings = async (contestId) => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/contest.standings`, {
      params: {
        contestId,
      },
      timeout: 10000,
    });

    if (res.data.status !== "OK") {
      return {
        success: false,
        reason: "ApiUnavailable",
        rows: [],
        problems: [],
      };
    }

    const problems = res.data.result.problems || [];

    const rows = (res.data.result.rows || []).map((row) => {
      const solvedProblemIndexes = (row.problemResults || [])
        .map((problemResult, index) => {
          if (
            problemResult.points > 0 ||
            problemResult.bestSubmissionTimeSeconds
          ) {
            return problems[index]?.index;
          }

          return null;
        })
        .filter(Boolean);

      return {
        handle: row.party?.members?.[0]?.handle,
        rank: row.rank,
        points: row.points,
        problemsSolved: solvedProblemIndexes.length,
        solvedProblemIndexes,
      };
    });

    return {
      success: true,
      rows,
      problems,
    };
  } catch (err) {
    console.error("Codeforces API error (fetchContestStandings):", err.message);

    return {
      success: false,
      reason: "ApiUnavailable",
      rows: [],
      problems: [],
    };
  }
};

/**
 * Fetches all submissions made by a specific handle during a contest.
 *
 * This is used as a fallback when the student's handle is not present
 * in contest.standings.
 */
const fetchContestSubmissions = async (contestId, handle) => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/contest.status`, {
      params: {
        contestId,
        handle,
      },
      timeout: 10000,
    });

    if (res.data.status !== "OK") {
      return {
        success: false,
        reason: "ApiUnavailable",
        submissions: [],
      };
    }

    return {
      success: true,
      submissions: res.data.result || [],
    };
  } catch (err) {
    console.error(
      `Codeforces API error (fetchContestSubmissions - ${handle}):`,
      err.message,
    );

    if (err.response?.status === 400) {
      return {
        success: false,
        reason: "InvalidHandle",
        submissions: [],
      };
    }

    return {
      success: false,
      reason: "ApiUnavailable",
      submissions: [],
    };
  }
};

/**
 * Fetches the user's rating history.
 *
 * Used to obtain the official contest rank when the public standings
 * response does not contain the student's row.
 */
const fetchUserRating = async (handle) => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/user.rating`, {
      params: {
        handle,
      },
      timeout: 10000,
    });

    if (res.data.status !== "OK") {
      return {
        success: false,
        reason: "ApiUnavailable",
        contests: [],
      };
    }

    return {
      success: true,
      contests: res.data.result || [],
    };
  } catch (err) {
    console.error(
      `Codeforces API error (fetchUserRating - ${handle}):`,
      err.message,
    );

    return {
      success: false,
      reason: "ApiUnavailable",
      contests: [],
    };
  }
};

/**
 * Builds a contest result from a student's submissions.
 *
 * This does NOT try to recreate Codeforces' official points calculation.
 * It only determines participation and solved problems.
 */
const buildResultFromSubmissions = (submissions) => {
  const solvedProblems = new Set();

  for (const submission of submissions) {
    if (submission.verdict === "OK" && submission.problem?.index) {
      solvedProblems.add(submission.problem.index);
    }
  }

  const solvedProblemIndexes = [...solvedProblems];

  return {
    problemsSolved: solvedProblemIndexes.length,
    solvedProblemIndexes,
  };
};

/**
 * Fetches a student's result for a specific contest.
 *
 * Strategy:
 *
 * 1. Check the public contest standings.
 * 2. If the handle exists there, use the official rank/points.
 * 3. If it does not exist there, check contest submissions.
 * 4. If submissions exist, the student participated.
 * 5. Use user.rating to obtain the official contest rank when available.
 */
const fetchStudentContestResult = async (contestId, handle) => {
  if (!handle || !handle.trim()) {
    return {
      success: false,
      reason: "NoHandle",
    };
  }

  const normalizedHandle = handle.trim().toLowerCase();

  // ---------------------------------------------------------
  // STEP 1: Fetch public contest standings
  // ---------------------------------------------------------
  const standings = await fetchContestStandings(contestId);

  if (!standings.success) {
    return {
      success: false,
      reason: "ApiUnavailable",
    };
  }

  const standingRow = standings.rows.find(
    (row) => row.handle?.toLowerCase() === normalizedHandle,
  );

  // ---------------------------------------------------------
  // STEP 2: Student exists in standings
  // ---------------------------------------------------------
  if (standingRow) {
    return {
      success: true,
      participated: true,
      source: "standings",
      handle,
      rank: standingRow.rank,
      points: standingRow.points,
      problemsSolved: standingRow.problemsSolved,
      solvedProblemIndexes: standingRow.solvedProblemIndexes,
      status: "Fetched",
    };
  }

  // ---------------------------------------------------------
  // STEP 3: Student not in standings.
  // Check contest submissions.
  // ---------------------------------------------------------
  const submissionsResult = await fetchContestSubmissions(contestId, handle);

  if (!submissionsResult.success) {
    return {
      success: false,
      reason: submissionsResult.reason,
    };
  }

  const submissions = submissionsResult.submissions;

  // No submissions means the student most likely did not participate.
  if (submissions.length === 0) {
    return {
      success: true,
      participated: false,
      source: "submissions",
      handle,
      status: "NotParticipated",
    };
  }

  // ---------------------------------------------------------
  // STEP 4: Student has submissions.
  // Therefore they participated.
  // ---------------------------------------------------------
  const submissionResult = buildResultFromSubmissions(submissions);

  // ---------------------------------------------------------
  // STEP 5: Try to obtain official rank from user.rating
  // ---------------------------------------------------------
  const ratingResult = await fetchUserRating(handle);

  let rank = null;
  let points = null;

  if (ratingResult.success) {
    const ratingContest = ratingResult.contests.find(
      (contest) => Number(contest.contestId) === Number(contestId),
    );

    if (ratingContest) {
      rank = ratingContest.rank;
    }
  }

  return {
    success: true,
    participated: true,
    source: "submissions",
    handle,
    rank,
    points,
    problemsSolved: submissionResult.problemsSolved,
    solvedProblemIndexes: submissionResult.solvedProblemIndexes,
    status: "Fetched",
  };
};

module.exports = {
  validateHandle,
  fetchContestStandings,
  fetchContestSubmissions,
  fetchUserRating,
  fetchStudentContestResult,
};
