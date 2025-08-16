const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  // username: { type: String, required: true, unique: true },
  email :{type: String, required: true, unique: true}, // Ensures email is unique
  password: { type: String, required: true },
  role: { type: String, default: "vendor" } // Ensures role is set to "vendor"
});

module.exports = mongoose.model("Vendor", vendorSchema);
