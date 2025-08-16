// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");

// // Create a new order
// router.post("/create", async (req, res) => {
//   try {
//     const { trackingId, status, location, customerName } = req.body;
//     if (!trackingId || !status || !customerName) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const existingOrder = await Order.findOne({ trackingId });
//     if (existingOrder) {
//       return res.status(400).json({ error: "Tracking ID already exists" });
//     }

//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json({ message: "Order created successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/:trackingId", async (req, res) => {
//   try {
//     const order = await Order.findOne({ trackingId: req.params.trackingId });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // Update order status and location
// router.put("/update/:trackingId", async (req, res) => {
//   try {
//     const { status, location } = req.body;
//     if (!status) {
//       return res.status(400).json({ error: "Status is required" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { trackingId: req.params.trackingId },
//       { status, location },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ error: "Order not found" });

//     res.json({ message: "Order updated successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const { trackingId, status, location, customerName, vendor } = req.body;
    if (!trackingId || !status || !customerName || !vendor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingOrder = await Order.findOne({ trackingId });
    if (existingOrder) {
      return res.status(400).json({ error: "Tracking ID already exists" });
    }

    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all orders for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ vendor: vendorId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this vendor" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch an order by tracking ID
router.get("/:trackingId", async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update order status and location
// router.put("/update/:trackingId", async (req, res) => {
//   try {
//     const { status, location } = req.body;
//     if (!status) {
//       return res.status(400).json({ error: "Status is required" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { trackingId: req.params.trackingId },
//       { status, location },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ error: "Order not found" });

//     res.json({ message: "Order updated successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.put("/update/:orderId", async (req, res) => {
  try {
    const { status, location } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Find order and update it
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, location }, 
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
