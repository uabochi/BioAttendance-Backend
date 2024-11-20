// models/userModel.js
const db = require("../db");

// Get user by email
function getUserByEmail(email, callback) {
  const query = "SELECT * FROM staff WHERE email = ?";
  db.query(query, [email], callback);
}

// Get user by ID
function getUserById(userId, callback) {
  const query = "SELECT * FROM staff WHERE id = ?";
  db.query(query, [userId], callback);
}

// Register user's WebAuthn credentials
function registerUserCredentials(userId, publicKey, credentialId, callback) {
  const query = "UPDATE staff SET public_key = ?, credential_id = ? WHERE id = ?";
  db.query(query, [publicKey, credentialId, userId], callback);
}

module.exports = { getUserByEmail, getUserById, registerUserCredentials };
