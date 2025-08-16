require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron"); // ✅ cron import
const Message = require("./models/Message"); // ✅ your message model

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

// ✅ MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Routes
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/orders", orderRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Base Route
app.get("/", (req, res) => {
  res.send("🚀 Logistics API is running...");
});

// ✅ Cron Job to delete read messages after 24 hours
cron.schedule("0 * * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  try {
    const result = await Message.deleteMany({
      isRead: true,
      markedReadAt: { $lte: cutoff },
    });
    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} old read messages`);
    }
  } catch (error) {
    console.error("❌ Cron Error deleting old read messages:", error);
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
