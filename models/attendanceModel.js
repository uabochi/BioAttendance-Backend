// models/attendanceModel.js
const db = require("../db");

// Mark attendance
function markAttendance(userId, status = "Present", callback) {
  const today = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

  const checkQuery = "SELECT * FROM attendance WHERE user_id = ? AND DATE(timestamp) = ?";
  db.query(checkQuery, [userId, today], (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      return callback(null, { message: "Attendance already marked for today" });
    }

    const query = "INSERT INTO attendance (user_id, status) VALUES (?, ?)";
    db.query(query, [userId, status], callback);
  });
}

// Get attendance records for a specific user
function getAttendanceByUserId(userId, callback) {
  const query = "SELECT * FROM attendance WHERE user_id = ? ORDER BY timestamp DESC";
  db.query(query, [userId], callback);
}

// Get attendance records for all staff
function getAllAttendanceRecords(callback) {
  const query = "SELECT * FROM attendance ORDER BY timestamp DESC";
  db.query(query, [], callback);
}

module.exports = { markAttendance, getAttendanceByUserId, getAllAttendanceRecords };
