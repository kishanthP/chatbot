const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false, index: true }, // Firebase UID
    title: { type: String, default: "New Chat" },
    messages: [messageSchema],
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Conversation", conversationSchema);