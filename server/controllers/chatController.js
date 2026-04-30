const { callGemini } = require("../services/geminiService");
const {
  createConversation,
  addMessages,
} = require("../services/conversationService");

const chatController = async (req, res) => {
  const { message, conversationId } = req.body;
  const userId = req.user.uid;

  try {
    const aiText = await callGemini(message);

    let conversation;
    if (conversationId) {
      // Continue existing conversation
      conversation = await addMessages(conversationId, message, aiText);
    } else {
      // New conversation - use first user message as title
      conversation = await createConversation(message, message, aiText, userId);
    }

    res.json({
      content: aiText,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { chatController };