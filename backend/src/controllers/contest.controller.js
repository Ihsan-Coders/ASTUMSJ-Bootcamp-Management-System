const Contest = require("../models/Contest");
const ContestResult = require("../models/ContestResult");
const User = require("../models/User");
const {
  validateHandle,
  fetchStudentContestResult,
} = require("../services/codeforces.service");

// ============================================================
// CREATE CONTEST
// ============================================================

const createContest = async (req, res) => {
  try {
    const contest = await Contest.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: contest,
      message: "Contest created",
    });
  } catch (err) {
    console.error("createContest error:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// ============================================================
// GET ALL CONTESTS
// ============================================================

const getContests = async (req, res) => {
  try {
    const { batchId } = req.query;

    const filter = batchId ? { batch: batchId } : {};

    const contests = await Contest.find(filter)
      .populate("batch", "name")
      .populate("createdBy", "name email")
      .sort({
        startTime: -1,
      });

    res.status(200).json({
      success: true,
      data: contests,
      message: "Contests fetched",
    });
  } catch (err) {
    console.error("getContests error:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// ============================================================
// GET SINGLE CONTEST
// ============================================================

const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate("batch", "name")
      .populate("createdBy", "name email");

    if (!contest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Contest not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contest,
      message: "Contest fetched",
    });
  } catch (err) {
    console.error("getContestById error:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// ============================================================
// FETCH CONTEST RESULTS
// ============================================================

const fetchResults = async (req, res) => {
  try {
    // ---------------------------------------------------------
    // 1. Find contest
    // ---------------------------------------------------------

    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Contest not found",
      });
    }

    // ---------------------------------------------------------
    // 2. Find active students in contest batch
    // ---------------------------------------------------------

    const students = await User.find({
      batch: contest.batch,
      role: "student",
      isActive: true,
    });

    const studentsWithHandle = students.filter(
      (student) => student.codeforcesHandle && student.codeforcesHandle.trim(),
    );

    const studentsWithoutHandle = students.filter(
      (student) =>
        !student.codeforcesHandle || !student.codeforcesHandle.trim(),
    );

    // ---------------------------------------------------------
    // 3. Save students without Codeforces handles
    // ---------------------------------------------------------

    await Promise.all(
      studentsWithoutHandle.map((student) =>
        ContestResult.findOneAndUpdate(
          {
            contest: contest._id,
            student: student._id,
          },
          {
            codeforcesHandle: "",
            status: "NoHandle",
            fetchedAt: new Date(),
          },
          {
            upsert: true,
            returnDocument: "after",
          },
        ),
      ),
    );

    // ---------------------------------------------------------
    // 4. No students with handles
    // ---------------------------------------------------------

    if (studentsWithHandle.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          fetched: 0,
          notParticipated: 0,
          noHandle: studentsWithoutHandle.length,
          invalidHandle: 0,
          apiUnavailable: 0,
        },
        message: "No students with a Codeforces handle to fetch",
      });
    }

    // ---------------------------------------------------------
    // Counters
    // ---------------------------------------------------------

    let fetchedCount = 0;
    let notParticipatedCount = 0;
    let invalidHandleCount = 0;
    let apiUnavailableCount = 0;

    // ---------------------------------------------------------
    // 5. Fetch each student's result
    // ---------------------------------------------------------

    await Promise.all(
      studentsWithHandle.map(async (student) => {
        const handle = student.codeforcesHandle.trim();

        // -----------------------------------------------------
        // 5a. Validate Codeforces handle
        // -----------------------------------------------------

        const validation = await validateHandle(handle);

        if (!validation.valid) {
          await ContestResult.findOneAndUpdate(
            {
              contest: contest._id,
              student: student._id,
            },
            {
              codeforcesHandle: handle,
              status: validation.reason,
              fetchedAt: new Date(),
            },
            {
              upsert: true,
              returnDocument: "after",
            },
          );

          if (validation.reason === "InvalidHandle") {
            invalidHandleCount++;
          }

          if (validation.reason === "ApiUnavailable") {
            apiUnavailableCount++;
          }

          return;
        }

        // -----------------------------------------------------
        // 5b. Fetch actual contest result
        // -----------------------------------------------------

        const result = await fetchStudentContestResult(
          contest.codeforcesContestId,
          handle,
        );

        // -----------------------------------------------------
        // 5c. API unavailable / invalid handle
        // -----------------------------------------------------

        if (!result.success) {
          await ContestResult.findOneAndUpdate(
            {
              contest: contest._id,
              student: student._id,
            },
            {
              codeforcesHandle: handle,
              status:
                result.reason === "InvalidHandle"
                  ? "InvalidHandle"
                  : "ApiUnavailable",
              fetchedAt: new Date(),
            },
            {
              upsert: true,
              returnDocument: "after",
            },
          );

          if (result.reason === "InvalidHandle") {
            invalidHandleCount++;
          } else {
            apiUnavailableCount++;
          }

          return;
        }

        // -----------------------------------------------------
        // 5d. Student did not participate
        // -----------------------------------------------------

        if (!result.participated) {
          await ContestResult.findOneAndUpdate(
            {
              contest: contest._id,
              student: student._id,
            },
            {
              codeforcesHandle: handle,
              status: "NotParticipated",
              fetchedAt: new Date(),
            },
            {
              upsert: true,
              returnDocument: "after",
            },
          );

          notParticipatedCount++;

          return;
        }

        // -----------------------------------------------------
        // 5e. Student participated
        // -----------------------------------------------------

        await ContestResult.findOneAndUpdate(
          {
            contest: contest._id,
            student: student._id,
          },
          {
            codeforcesHandle: handle,
            rank: result.rank,
            points: result.points,
            problemsSolved: result.problemsSolved,
            solvedProblemIndexes: result.solvedProblemIndexes,
            status: "Fetched",
            fetchedAt: new Date(),
          },
          {
            upsert: true,
            returnDocument: "after",
          },
        );

        fetchedCount++;
      }),
    );

    // ---------------------------------------------------------
    // 6. Response
    // ---------------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        fetched: fetchedCount,
        notParticipated: notParticipatedCount,
        noHandle: studentsWithoutHandle.length,
        invalidHandle: invalidHandleCount,
        apiUnavailable: apiUnavailableCount,
      },

      message: "Results fetched from Codeforces",
    });
  } catch (err) {
    console.error("fetchResults error:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// ============================================================
// GET CONTEST LEADERBOARD
// ============================================================

const getContestLeaderboard = async (req, res) => {
  try {
    // ---------------------------------------------------------
    // 1. Find contest
    // ---------------------------------------------------------

    const contest = await Contest.findById(req.params.id)
      .populate("batch", "name")
      .populate("createdBy", "name email");

    if (!contest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Contest not found",
      });
    }

    // ---------------------------------------------------------
    // 2. Get all contest results
    // ---------------------------------------------------------

    const results = await ContestResult.find({
      contest: contest._id,
    })
      .populate("student", "name email codeforcesHandle")
      .sort({
        rank: 1,
        points: -1,
        problemsSolved: -1,
      });

    // ---------------------------------------------------------
    // 3. Build clean leaderboard
    // ---------------------------------------------------------

    const leaderboard = results.map((result, index) => ({
      position: result.status === "Fetched" ? index + 1 : null,

      student: result.student
        ? {
            id: result.student._id,
            name: result.student.name,
            email: result.student.email,
          }
        : null,

      codeforcesHandle:
        result.student?.codeforcesHandle || result.codeforcesHandle || "",

      rank: result.rank,

      points: result.points ?? 0,

      problemsSolved: result.problemsSolved ?? 0,

      solvedProblemIndexes: result.solvedProblemIndexes || [],

      status: result.status,

      fetchedAt: result.fetchedAt,
    }));

    // ---------------------------------------------------------
    // 4. Statistics
    // ---------------------------------------------------------

    const statistics = {
      totalStudents: leaderboard.length,

      participated: leaderboard.filter((result) => result.status === "Fetched")
        .length,

      notParticipated: leaderboard.filter(
        (result) => result.status === "NotParticipated",
      ).length,

      noHandle: leaderboard.filter((result) => result.status === "NoHandle")
        .length,

      invalidHandle: leaderboard.filter(
        (result) => result.status === "InvalidHandle",
      ).length,

      apiUnavailable: leaderboard.filter(
        (result) => result.status === "ApiUnavailable",
      ).length,
    };

    // ---------------------------------------------------------
    // 5. Response
    // ---------------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        contest: {
          id: contest._id,
          name: contest.name,
          contestUrl: contest.contestUrl,
          batch: contest.batch,
          startTime: contest.startTime,
          durationMinutes: contest.durationMinutes,
          status: contest.status,
        },

        statistics,

        leaderboard,
      },

      message: "Contest leaderboard fetched",
    });
  } catch (err) {
    console.error("getContestLeaderboard error:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createContest,
  getContests,
  getContestById,
  fetchResults,
  getContestLeaderboard,
};
