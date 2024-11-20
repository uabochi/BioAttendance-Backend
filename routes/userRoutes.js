const express = require("express");
const router = express.Router();
const db = require("../db");

// Add a new staff member
router.post("/add", async (req, res, next) => {
  const { name, email, biometric_template } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query = "INSERT INTO staff (name, email, biometric_template) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(query, [name, email, biometric_template || null]);
    res.json({ success: true, message: "Staff added successfully", result });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Get all staff
router.get("/", async (req, res, next) => {
  const query = "SELECT * FROM staff";
  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Update staff biometric data
router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;
  const { biometric_template } = req.body;

  if (!biometric_template) {
    return res.status(400).json({ error: "Biometric template is required" });
  }

  const query = "UPDATE staff SET biometric_template = ? WHERE id = ?";
  try {
    const [result] = await db.query(query, [biometric_template, id]);
    res.json({ success: true, message: "Staff updated successfully", result });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Delete staff
router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  const query = "DELETE FROM staff WHERE id = ?";
  try {
    const [result] = await db.query(query, [id]);
    res.json({ success: true, message: "Staff deleted successfully", result });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

module.exports = router;
