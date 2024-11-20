const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Mark attendance
router.post("/mark", attendanceController.markAttendance);

// Get attendance records for a specific user
router.get("/:user_id", attendanceController.getAttendance);

module.exports = router;
