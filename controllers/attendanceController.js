const db = require('../utils/db');

// Helper function to fetch staff by biometric data or email
async function getStaffByBiometricOrEmail(biometricData, email) {
    if (biometricData) {
        const [rows] = await db.query('SELECT * FROM staff WHERE biometric_template = ?', [biometricData]);
        return rows.length > 0 ? rows[0] : null;
    }
    if (email) {
        const [rows] = await db.query('SELECT * FROM staff WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    return null;
}

// Mark attendance function
exports.markAttendance = async (req, res) => {
    const { biometricData, email } = req.body;

    if (!biometricData && !email) {
        return res.status(400).json({ error: 'Either biometric data or email is required' });
    }

    try {
        // Fetch staff using helper function
        const staff = await getStaffByBiometricOrEmail(biometricData, email);

        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        // Mark attendance
        await db.query('INSERT INTO attendance (user_id, status) VALUES (?, ?)', [staff.id, 'Present']);

        res.status(200).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error.message); // Log error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};
