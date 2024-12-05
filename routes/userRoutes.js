const express = require("express");
const router = express.Router();
const db = require("../db");

// Add a new student member
router.post("/add", async (req, res, next) => {
  const { name, email, created_by } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query = "INSERT INTO staff (name, email, created_by) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(query, [name, email, created_by || null]);
    res.json({ success: true, message: "Staff added successfully", result });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Get all students
router.get("/", async (req, res, next) => {
  const query = "SELECT * FROM staff";
  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Get all students by admin
router.get("/:created_by", async (req, res, next) => {
  const {created_by} = req.params;
  const query = "SELECT * FROM staff WHERE created_by = ?";
  try {
    const [result] = await db.query(query, [created_by]);
    res.json(result);
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// Update student biometric data
router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;
  const { biometric_template } = req.body;

  if (!biometric_template) {
    return res.status(400).json({ error: "Biometric template is required" });
  }

  const query = "UPDATE staff SET biometric_template = ? WHERE id = ?";
  try {
    // Execute the query to update the biometric template for the specified student member
    const [result] = await db.query(query, [biometric_template, id]);

    if (result.affectedRows === 0) {
      // If no rows are affected, the staff with the given id was not found
      return res.status(404).json({ error: "Staff member not found" });
    }

    // If successful, return a success response
    res.json({ success: true, message: "Staff updated successfully", result });
  } catch (err) {
    // Pass any errors to the global error handler
    next(err);
  }
});

// Delete student
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
