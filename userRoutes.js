const express = require("express");
const router = express.Router(); // ✅ This defines the router
const User = require("../models/User"); // ✅ Ensure User model is correctly imported
const bcrypt = require("bcryptjs");

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Invalid Credentials!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!" });

    res.json({ message: "Admin Login Successful!", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router; // ✅ Export router properly

