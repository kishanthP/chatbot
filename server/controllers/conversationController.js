const {
  getAllConversations,
  getConversationById,
  deleteConversation,
  searchConversations,
} = require("../services/conversationService");

const getAll = async (req, res) => {
  try {
    const conversations = await getAllConversations(req.user.uid);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getOne = async (req, res) => {
  try {
    const conversation = await getConversationById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Not found" });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

const deleteOne = async (req, res) => {
  try {
    await deleteConversation(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
};

const search = async (req, res) => {
  try {
    const results = await searchConversations(req.query.q || "", req.user.uid);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

module.exports = { getAll, getOne, deleteOne, search };