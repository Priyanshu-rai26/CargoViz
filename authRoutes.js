const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// ✅ Admin Login
router.post(
  "/admin/login",
  [
    body("username").notEmpty(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email , role: "admin" });
      if (!user) return res.status(400).json({ error: "Admin not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Vendor Login
router.post(
  "/vendor/login",
  [
    body("username").notEmpty(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username, role: "vendor" });
      if (!user) return res.status(400).json({ error: "Vendor not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: "vendor" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Admin Creates Vendor
router.post(
  "/admin/create-vendor",
  [
    body("username").notEmpty(),
    body("password").isLength({ min: 4 }),
  ],
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount > 2) return res.status(400).json({ error: "Only 2 admins allowed" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newVendor = new User({ username, password: hashedPassword, role: "vendor" });

      await newVendor.save();
      res.json({ message: "Vendor created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
