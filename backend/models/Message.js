

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  groupName: { type: String },
  receiver: { type: String },
  seenBy: [{ type: String, default: [] }],
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);