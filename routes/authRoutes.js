const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyAdmin } = require('../utils/authUtils');

// Route for registering user (fingerprint registration)
router.post("/register", authController.registerUser);

// Route for authenticating user (fingerprint login)
router.post("/authenticate", authController.authenticateUser);

// Route for admin login 
router.post("/login", authController.adminLogin);

// Example of a protected route (requires admin verification)
router.post('/protected-route', verifyAdmin, (req, res) => {
    res.json({ message: 'Access granted', admin: req.admin });
});

module.exports = router;
