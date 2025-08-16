const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

// Get Orders for a Specific Vendor
router.get("/orders/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;
        const orders = await Order.find({ vendorId });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

//vendor login
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
      }
  
      const vendor = await Vendor.findOne({ email });
      if (!vendor) return res.status(400).json({ message: "Vendor not found!" });
      console.log(email, password, vendor);

      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!" });
  
      res.json({ message: "Vendor Login Successful!", vendor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
