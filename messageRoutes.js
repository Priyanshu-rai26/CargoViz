// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST new message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Mark message as read
router.put("/mark-read/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, markedReadAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a message
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
