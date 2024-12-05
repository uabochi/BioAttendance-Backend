const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mailController");

// Send Mail
router.post("/send", mailController.sendMail);

module.exports = router;