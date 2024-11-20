const express = require("express");
const router = express.Router();
const db = require("../db");

// Mark attendance
router.post("/mark", async (req, res) => {
  console.log("/mark reached");
  const { user_id, status } = req.body;

  // Check if user_id and status are provided
  if (!user_id || !status) {
    console.log("check user reached");
    return res.status(400).json({ error: "User ID and status are required" });
  }

  // Validate status value (optional: to avoid wrong status entries)
  const validStatuses = ["Present", "Absent"];
  if (!validStatuses.includes(status)) {
    console.log("/validated status reached");
    return res.status(400).json({ error: "Invalid status value. Valid options are 'Present' or 'Absent'" });
  }

  const today = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

  try {
    // Check if attendance is already marked for the day
    const checkQuery = "SELECT * FROM attendance WHERE user_id = ? AND DATE(timestamp) = ?";
    const [results] = await db.query(checkQuery, [user_id, today]);
    console.log("/checkQuery reached");

    if (results.length > 0) {
      return res.status(400).json({ error: "Attendance already marked for today" });
    }

    // Insert attendance record
    const query = "INSERT INTO attendance (user_id, status) VALUES (?, ?)";
    const [result] = await db.query(query, [user_id, status]);
    console.log("insert attendance reached");
    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get attendance for a specific user
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT * FROM attendance WHERE user_id = ?";
  
  try {
    const [results] = await db.query(query, [user_id]); // Await the promise

    if (results.length === 0) {
      return res.status(404).json({ error: "No attendance records found for this user" });
    }

    res.json(results); // Return the fetched attendance records
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
