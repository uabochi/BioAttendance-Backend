//authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const webauthnUtils = require('../utils/webauthnUtils');

//Get admin details by email to confirm login details
exports.adminLogin = async (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin) {
      return res.status(400).json({ error: 'Email and PIN are required' });
  }

  try {
      const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
      if (rows.length === 0) {
        console.log("first");
          return res.status(404).json({ error: 'Admin not found' });
      }

      console.log("second");
      const admin = rows[0];
      console.log('Provided Pin:', pin);
      console.log('Stored Pin Hash:', admin.pin);
      const isMatch = await bcrypt.compare(pin, admin.pin);

      if (!isMatch) {
        console.log("third");
          return res.status(401).json({ error: 'Invalid PIN' });
      }

      console.log("forth");
      const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
          expiresIn: '1h',
      });
      console.log("fifth");

      res.status(200).json({ message: 'Login successful', name: admin.name, id: admin.id, token });
  } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Register user and store WebAuthn credential information (public key)
exports.registerUser = async (req, res) => {
  const { userId, publicKey, credentialId } = req.body;

  if (!userId || !publicKey || !credentialId) {
    return res.status(400).json({ error: 'User ID, public key, and credential ID are required' });
  }

  const query = "UPDATE staff SET public_key = ?, credential_id = ? WHERE id = ?";
  
  try {
    await db.query(query, [publicKey, credentialId, userId]);
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Authenticate user by verifying the fingerprint (WebAuthn)
exports.authenticateUser = async (req, res) => {
  const { assertion, userId } = req.body;

  if (!assertion || !userId) {
    return res.status(400).json({ error: 'Assertion and user ID are required' });
  }

  try {
    // Retrieve the stored public key and credential ID for the user
    const [result] = await db.query("SELECT public_key, credential_id FROM staff WHERE id = ?", [userId]);
    if (result.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const storedPublicKey = result[0].public_key;
    const storedCredentialId = result[0].credential_id;

    // Validate the WebAuthn assertion
    const isValid = webauthnUtils.verifyAssertion(assertion, storedPublicKey, storedCredentialId);

    if (isValid) {
      // Mark attendance as "Present" in the database
      const attendanceQuery = "INSERT INTO attendance (user_id, status) VALUES (?, 'Present')";
      await db.query(attendanceQuery, [userId]);

      res.json({ success: true, message: 'Attendance marked successfully' });
    } else {
      res.status(400).json({ error: 'Fingerprint authentication failed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error processing authentication', details: err.message });
  }
};
