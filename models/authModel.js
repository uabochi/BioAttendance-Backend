// models/authModel.js
const db = require("../db");

// Get admin by email
function getAdminByEmail(email, callback) {
  const query = "SELECT * FROM admins WHERE email = ?";
  db.query(query, [email], callback);
}

// Update admin PIN (for example, if resetting PIN)
function updateAdminPin(adminId, newPin, callback) {
  const query = "UPDATE admins SET pin = ? WHERE id = ?";
  db.query(query, [newPin, adminId], callback);
}

module.exports = { getAdminByEmail, updateAdminPin };
