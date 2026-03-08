require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// MySQL Database Configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,        
  database: "sports_db"     
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "website"))); // Folder for frontend

// POST: Book appointment
app.post("/book-appointment", [
  check("sport").notEmpty().withMessage("Sport is required"),
  check("fullName").notEmpty().withMessage("Full name is required"),
  check("phone")
    .notEmpty().withMessage("Phone is required")
    .isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 digits")
    .isNumeric().withMessage("Phone must be numbers only"),
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
  check("paymentMethod").notEmpty().withMessage("Payment method is required"),
  check("date").notEmpty().withMessage("Date is required"),
  check("time").notEmpty().withMessage("Time is required"),
  check("stadium").notEmpty().withMessage("Stadium is required")
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    sport, fullName, phone, email, paymentMethod,
    date, time, stadium
  } = req.body;

  const sql = `
    INSERT INTO bookings (
      sport, fullName, phone, email, paymentMethod,
      date, time, stadium
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sport, fullName, phone, email, paymentMethod,
    date, time, stadium
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error during booking:", err);
      res.status(500).send("❌ Failed to save booking.");
    } else {
      res.status(200).json({ message: "✅ Booking saved successfully!", insertId: result.insertId });
    }
  });
});

// GET: Retrieve appointment by ID
app.get("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM bookings WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching booking data:", err);
      return res.status(500).send("❌ Failed to fetch booking data.");
    }

    if (results.length === 0) {
      return res.status(404).send("🚫 No booking found with this ID.");
    }

    res.json(results[0]);
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});


