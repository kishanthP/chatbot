import { useState } from "react";
import {
  Box, Button, Typography, List, ListItemButton,
  ListItemText, Divider, Avatar, IconButton, TextField,
  InputAdornment, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

const SIDEBAR_WIDTH = 260;

const Sidebar = ({ conversations, currentId, onNewChat, onSelectConversation, onDelete, onSearch, mode, toggleMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isLight = mode === "light";
  const { user, logout } = useAuth();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Determine display name and avatar letter
  const displayName = user?.displayName || user?.phoneNumber || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const photoURL = user?.photoURL;

  return (
    <Box sx={{
      width: SIDEBAR_WIDTH,
      flexShrink: 0,
      bgcolor: isLight ? "#f0ede8" : "#171717",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: isLight ? "1px solid #e0ddd8" : "1px solid #2a2a2a",
    }}>

      {/* Logo + Toggle */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#d4956a", boxShadow: "0 0 12px rgba(212,149,106,0.4)" }}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary" letterSpacing={0.3}>
            Kishanth AI
          </Typography>
        </Box>

        {/* Dark / Light Toggle */}
        <Tooltip title={isLight ? "Dark mode" : "Light mode"} placement="right">
          <IconButton onClick={toggleMode} size="small"
            sx={{
              color: isLight ? "#555" : "#888",
              "&:hover": { color: "#d4956a", bgcolor: isLight ? "#e8e5e0" : "#222" },
            }}>
            {isLight ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* New Chat */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={onNewChat}
          sx={{
            borderColor: isLight ? "#d0cdc8" : "#303030",
            color: "text.primary",
            justifyContent: "flex-start",
            py: 1,
            fontSize: "0.875rem",
            "&:hover": {
              bgcolor: isLight ? "#e8e5e0" : "#252525",
              borderColor: isLight ? "#b0ada8" : "#404040",
            },
          }}>
          New chat
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <TextField
          fullWidth size="small" placeholder="Search chats…"
          value={searchQuery} onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: isLight ? "#999" : "#555" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: isLight ? "#e8e5e0" : "#1e1e1e",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              "& fieldset": { borderColor: isLight ? "#d0cdc8" : "#2e2e2e" },
              "&:hover fieldset": { borderColor: isLight ? "#b0ada8" : "#3e3e3e" },
              "&.Mui-focused fieldset": { borderColor: "#d4956a" },
            },
            "& .MuiInputBase-input": {
              color: isLight ? "#1a1a1a" : "#ccc",
              py: 0.85,
              "&::placeholder": { color: isLight ? "#999" : "#555", opacity: 1 },
            },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: isLight ? "#e0ddd8" : "#242424" }} />

      {/* Conversation List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1.5 }}>
        {conversations.length > 0 && (
          <>
            <Typography variant="caption"
              sx={{ px: 2.5, color: "text.secondary", display: "block", mb: 0.5,
                fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1 }}>
              Recent
            </Typography>
            <List dense disablePadding>
              {conversations.map((conv) => (
                <ListItemButton key={conv._id}
                  selected={conv._id === currentId}
                  onClick={() => onSelectConversation(conv._id)}
                  sx={{
                    borderRadius: "8px", mx: 1, mb: 0.25, py: 0.9, pr: 0.5,
                    "&.Mui-selected": {
                      bgcolor: isLight ? "#e2dfd9" : "#2a2a2a",
                      "&:hover": { bgcolor: isLight ? "#dedad4" : "#2e2e2e" },
                    },
                    "&:hover": {
                      bgcolor: isLight ? "#e8e5e0" : "#222222",
                      "& .delete-btn": { opacity: 1 },
                    },
                  }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: 15, mr: 1.5, color: "text.secondary", flexShrink: 0 }} />
                  <ListItemText primary={conv.title}
                    primaryTypographyProps={{ fontSize: "0.8125rem", noWrap: true, color: "text.primary" }} />
                  <IconButton size="small" className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
                    sx={{
                      opacity: 0, transition: "opacity 0.15s",
                      color: isLight ? "#999" : "#666",
                      "&:hover": { color: "#ff5555", bgcolor: "transparent" },
                      ml: 0.5,
                    }}>
                    <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </>
        )}

        {conversations.length === 0 && (
          <Typography variant="caption"
            sx={{ px: 2.5, color: isLight ? "#999" : "#505050", display: "block", mt: 1 }}>
            {searchQuery ? "No results found" : "No conversations yet"}
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: isLight ? "#e0ddd8" : "#242424" }} />

      {/* ── User Profile + Logout ─────────────────────────────────────── */}
      <Box sx={{
        p: 1.5, display: "flex", alignItems: "center", gap: 1.25,
        "&:hover": { bgcolor: isLight ? "#e8e5e0" : "#1e1e1e" },
        borderRadius: "0 0 0 0", transition: "background 0.15s",
        cursor: "default",
      }}>
        <Avatar
          src={photoURL || undefined}
          sx={{
            width: 32, height: 32, fontSize: "0.875rem", fontWeight: 700,
            bgcolor: "#d4956a", flexShrink: 0,
          }}
        >
          {!photoURL && avatarLetter}
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="caption" fontWeight={600} color="text.primary"
            sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.8rem" }}
          >
            {displayName}
          </Typography>
          {user?.email && (
            <Typography
              variant="caption" color="text.secondary"
              sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.7rem" }}
            >
              {user.email}
            </Typography>
          )}
        </Box>

        <Tooltip title="Sign out" placement="right">
          <IconButton
            id="logout-btn"
            size="small"
            onClick={logout}
            sx={{
              color: isLight ? "#999" : "#555",
              flexShrink: 0,
              "&:hover": { color: "#ff6b6b", bgcolor: "transparent" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;