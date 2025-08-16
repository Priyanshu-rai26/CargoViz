const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Shipped", "In Transit", "Delivered"], 
    default: "Pending" 
  },
  location: { type: String, required: true },
  vendor: { type: String, required: true }, // Vendor who manages the order
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
