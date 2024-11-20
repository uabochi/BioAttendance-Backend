const db = require("../utils/db");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  const { id } = req.body;

  // Validate the required input
  if (!id) {
    return res.status(400).json({ error: "Staff ID is required" });
  }

  try {
    // Check if the staff exists
    const [staff] = await db.query("SELECT id FROM staff WHERE id = ?", [id]);

    if (staff.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    // Check if attendance is already marked for the day
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const [existingAttendance] = await db.query(
      "SELECT id FROM attendance WHERE user_id = ? AND DATE(timestamp) = ?",
      [id, today]
    );

    if (existingAttendance.length > 0) {
      return res
        .status(400)
        .json({ error: "Attendance already marked for today" });
    }

    // Mark attendance
    await db.query("INSERT INTO attendance (user_id, status) VALUES (?, ?)", [
      id,
      "Present",
    ]);

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Attendance for a Specific User
exports.getAttendance = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Fetch attendance records for the given user
    const [attendanceRecords] = await db.query(
      "SELECT * FROM attendance WHERE user_id = ?",
      [user_id]
    );

    if (attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ error: "No attendance records found for this user" });
    }

    res.status(200).json(attendanceRecords); // Return attendance records
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};




// Helper function to fetch staff by biometric data or email
// async function getStaffByBiometricOrEmail(biometricData, email) {
//     if (biometricData) {
//         const [rows] = await db.query('SELECT * FROM staff WHERE biometric_template = ?', [biometricData]);
//         return rows.length > 0 ? rows[0] : null;
//     }
//     if (email) {
//         const [rows] = await db.query('SELECT * FROM staff WHERE email = ?', [email]);
//         return rows.length > 0 ? rows[0] : null;
//     }
//     return null;
// }

// // Mark attendance function
// exports.markAttendance = async (req, res) => {
//     const { biometricData, email } = req.body;

//     if (!biometricData && !email) {
//         return res.status(400).json({ error: 'Either biometric data or email is required' });
//     }

//     try {
//         // Fetch staff using helper function
//         const staff = await getStaffByBiometricOrEmail(biometricData, email);

//         if (!staff) {
//             return res.status(404).json({ error: 'Staff not found' });
//         }

//         // Mark attendance
//         await db.query('INSERT INTO attendance (user_id, status) VALUES (?, ?)', [staff.id, 'Present']);

//         res.status(200).json({ message: 'Attendance marked successfully' });
//     } catch (error) {
//         console.error('Error marking attendance:', error.message); // Log error for debugging
//         res.status(500).json({ error: 'Server error' });
//     }
// };
