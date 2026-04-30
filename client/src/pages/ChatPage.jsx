import { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatPage = ({ mode, toggleMode }) => {
  const { idToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build a pre-configured axios instance with the Firebase ID token
  const api = useCallback(() => {
    return axios.create({
      baseURL: API,
      headers: { Authorization: `Bearer ${idToken}` },
    });
  }, [idToken]);

  useEffect(() => {
    if (idToken) fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToken]);

  const fetchConversations = async () => {
    try {
      const res = await api().get("/api/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      const res = await api().get(`/api/conversations/${id}`);
      setMessages(res.data.messages);
      setCurrentConversationId(id);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleDelete = async (id) => {
    try {
      await api().delete(`/api/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (currentConversationId === id) {
        setMessages([]);
        setCurrentConversationId(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) { fetchConversations(); return; }
    try {
      const res = await api().get(`/api/conversations/search?q=${query}`);
      setConversations(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleSend = useCallback(
    async (text) => {
      const userMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const res = await api().post("/api/chat", {
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
          { role: "assistant", content: "❌ Something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentConversationId, idToken]
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
        mode={mode}
        toggleMode={toggleMode}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        <ChatWindow messages={messages} loading={loading} />
        <InputBar onSend={handleSend} disabled={loading} />
      </Box>
    </Box>
  );
};

export default ChatPage;