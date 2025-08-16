// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {type: Date,default: Date.now,},
  isRead: {type: Boolean,default: false,},
  markedReadAt: Date,
});

module.exports = mongoose.model("Message", messageSchema);
