const Contest = require("../models/Contest");
const ContestResult = require("../models/ContestResult");
const User = require("../models/User");

const {
  validateHandle,
  fetchStudentContestResult,
} = require("../services/codeforces.service");

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
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

const getContests = async (req, res) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};

    const contests = await Contest.find(filter).sort({
      startTime: -1,
    });

    res.status(200).json({
      success: true,
      data: contests,
      message: "Contests fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

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
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

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
    // 2. Find active students in the contest batch
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
    // 3. Save students who don't have Codeforces handles
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
    // 5. Fetch each student's contest result
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
        // 5b. Fetch student's actual contest result
        //
        // This first checks standings.
        // If the student isn't there, it checks submissions.
        // -----------------------------------------------------
        const result = await fetchStudentContestResult(
          contest.codeforcesContestId,
          handle,
        );

        // -----------------------------------------------------
        // 5c. Codeforces API unavailable
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

const getContestLeaderboard = async (req, res) => {
  try {
    const results = await ContestResult.find({
      contest: req.params.id,
      status: "Fetched",
    })
      .populate("student", "name")
      .sort({ rank: 1 });

    res.status(200).json({
      success: true,
      data: results,
      message: "Contest leaderboard fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

module.exports = {
  createContest,
  getContests,
  getContestById,
  fetchResults,
  getContestLeaderboard,
};
