// require("dotenv").config();

// const app = require("./app");
// const connectDB = require("./config/db");
// const cloudinary = require("./config/cloudinary");

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
require("./config/cloudinary");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
