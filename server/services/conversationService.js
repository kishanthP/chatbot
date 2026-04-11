const Conversation = require("../models/Conversation");

// Get all conversations (only id + title + updatedAt, no messages - for sidebar)
const getAllConversations = async () => {
  return await Conversation.find({}, "title updatedAt createdAt")
    .sort({ updatedAt: -1 });
};

// Get single conversation with all messages
const getConversationById = async (id) => {
  return await Conversation.findById(id);
};

// Create new conversation
const createConversation = async (title, userMessage, aiMessage) => {
  const conversation = new Conversation({
    title: title.slice(0, 50),
    messages: [
      { role: "user", content: userMessage },
      { role: "assistant", content: aiMessage },
    ],
  });
  return await conversation.save();
};

// Add messages to existing conversation
const addMessages = async (id, userMessage, aiMessage) => {
  return await Conversation.findByIdAndUpdate(
    id,
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: userMessage },
            { role: "assistant", content: aiMessage },
          ],
        },
      },
      updatedAt: new Date(),
    },
    { returnDocument: 'after' }
  );
};

// Delete conversation
const deleteConversation = async (id) => {
  return await Conversation.findByIdAndDelete(id);
};

// Search conversations by title
const searchConversations = async (query) => {
  return await Conversation.find(
    { title: { $regex: query, $options: "i" } },
    "title updatedAt"
  ).sort({ updatedAt: -1 });
};

module.exports = {
  getAllConversations,
  getConversationById,
  createConversation,
  addMessages,
  deleteConversation,
  searchConversations,
};