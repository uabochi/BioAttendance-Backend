const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Routes
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

require("dotenv").config();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Biometric Attendance API is running");
});

// Use Routes
app.use("/student", userRoutes);
app.use("/auth", authRoutes); // Authentication (WebAuthn) routes
app.use("/attendance", attendanceRoutes); // Attendance management routes

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
