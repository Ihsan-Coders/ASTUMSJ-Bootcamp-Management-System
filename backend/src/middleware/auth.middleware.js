const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Not authorized",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "astumsj-bootcamp",
      audience: "astumsj-users",
    });

    const user = await User.findById(decoded.sub).select(
      "_id name email role isActive batch codeforcesHandle",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "User no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Account is disabled",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
      batch: user.batch ? user.batch.toString() : null,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid or expired token",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      data: null,
      message: "Authentication failed",
    });
  }
};

module.exports = protect;
