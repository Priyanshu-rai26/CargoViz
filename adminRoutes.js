const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");

//admin register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ email , password: hashedPassword });
  await newAdmin.save();
  res.status(201).json({ message: "Admin registered successfully" });
});

//admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid Credentials!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!" });

    res.json({ message: "Admin Login Successful!", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a new vendor
router.post("/create-vendor", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({ email, password: hashedPassword, role: "vendor" });
    await newVendor.save();
    res.status(201).json({ message: "Vendor created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating vendor", error });
  }
});

// Fetch all vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error });
  }
});

// Delete a vendor by ID
router.delete('/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedVendor = await Vendor.findByIdAndDelete(id);
      if (!deletedVendor) {
          return res.status(404).json({ message: 'Vendor not found' });
      }
      res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting vendor' });
  }
});

module.exports = router;
