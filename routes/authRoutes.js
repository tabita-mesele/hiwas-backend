const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const SECRET = "hiwas_secret_key";

// 👉 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find admin
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // 2. Safety check (prevents crash)
    if (!admin.password) {
      return res.status(500).json({ message: "Admin password not set in DB" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: "admin" // fixed (no dependency on DB field)
      },
      SECRET,
      { expiresIn: "1h" }
    );

    // 5. Response
    res.json({
      token,
      role: "admin"
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;