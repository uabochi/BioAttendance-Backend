const bcrypt = require("bcryptjs");
const pool = require("../db"); // Adjust the path to your db.js
require("dotenv").config();

async function createAdmin() {
  const admin = {
    name: "3MTT RiverState", // Change this if needed
    email: "3mtt@rivers.state", // Change this if needed
    pin: "0000", // Default PIN (must be updated after first login)
  };

  try {
    // Hash the PIN
    const hashedPin = await bcrypt.hash(admin.pin, 10);

    // Insert the admin into the database
    const [result] = await pool.query(
      "INSERT INTO admins (name, email, pin) VALUES (?, ?, ?)",
      [admin.name, admin.email, hashedPin]
    );

    console.log(`Admin created successfully with ID: ${result.insertId}`);
    process.exit(0); // Exit the script successfully
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.error("Admin with this email already exists.");
    } else {
      console.error("Error creating admin:", error.message);
    }
    process.exit(1); // Exit the script with an error
  }
}

// Run the script
createAdmin();
