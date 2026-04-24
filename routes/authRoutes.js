const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const SECRET = "hiwas_secret_key";

// 👉 LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

 const token = jwt.sign(
  { id: admin._id, role: admin.role },
  SECRET,
  { expiresIn: "1h" }
);

res.json({
  token,
  role: admin.role,
});
});

module.exports = router;