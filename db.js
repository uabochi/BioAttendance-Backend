const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Default to localhost if not provided
  user: process.env.DB_USER || "root", // Default to root if not provided
  password: process.env.DB_PASSWORD || "", // Default to an empty string if not provided
  database: process.env.DB_NAME || "taskmaster", // Default database name
  waitForConnections: true, // Wait for a connection if none are available
  connectionLimit: 10, // Limit the number of concurrent connections
  queueLimit: 0, // No limit on the queue
});

// Utility function to check the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection established successfully.");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

testConnection(); // Test the database connection on startup

module.exports = pool;
