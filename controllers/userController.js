const mailController = require("../controllers/mailController");
const db = require('../utils/db');
import {sendMail} from "../scripts/sendMail";

// Example: Get user by email
exports.getUser = async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    try {
      const [results] = await db.query('SELECT * FROM staff WHERE email = ?', [email]);
      
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(results[0]);
    } catch (error) {
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  };
  
exports.addStaff = async (req, res) => {
    const { name, email, created_by } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    try {
      const [result] = await db.query(
        'INSERT INTO staff (name, email, created_by) VALUES (?, ?, ?)',
        [name, email, created_by || null]
      );
      res.status(201).json({ message: 'Staff added successfully', staffId: result.insertId });
      sendMail(email, name, result.insertId);
      
      // mailController.sendMail()
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  

exports.updateStaffEmail = async (req, res) => {
    const { staffId, newEmail } = req.body;
  
    if (!staffId || !newEmail) {
      return res.status(400).json({ error: 'Staff ID and new email are required' });
    }
  
    try {
      // Check if email already exists
      const [existingUser] = await db.query('SELECT * FROM staff WHERE email = ?', [newEmail]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      await db.query('UPDATE staff SET email = ? WHERE id = ?', [newEmail, staffId]);
      res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  
