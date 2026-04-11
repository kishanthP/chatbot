import { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";

const ChatPage = ({ mode, toggleMode }) => {  // ← accept mode + toggleMode
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations");
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/conversations/${id}`);
      setMessages(res.data.messages);
      setCurrentConversationId(id);
    } catch (err) {
      console.error("Failed to load conversation");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (currentConversationId === id) {
        setMessages([]);
        setCurrentConversationId(null);
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchConversations();
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/conversations/search?q=${query}`
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Search failed");
    }
  };

  const handleSend = useCallback(
    async (text) => {
      const userMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const res = await axios.post("http://localhost:5000/api/chat", {
          message: text,
          conversationId: currentConversationId,
        });

        const aiMessage = { role: "assistant", content: res.data.content };
        setMessages((prev) => [...prev, aiMessage]);

        if (!currentConversationId) {
          setCurrentConversationId(res.data.conversationId);
          fetchConversations();
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [currentConversationId]
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", overflow: "hidden", maxWidth: "100%" }}>
      <Sidebar
        conversations={conversations}
        currentId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDelete={handleDelete}
        onSearch={handleSearch}
        mode={mode}              // ← pass down
        toggleMode={toggleMode}  // ← pass down
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        <ChatWindow messages={messages} loading={loading} />
        <InputBar onSend={handleSend} disabled={loading} />
      </Box>
    </Box>
  );
};

export default ChatPage;