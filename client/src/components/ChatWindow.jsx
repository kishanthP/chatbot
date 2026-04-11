import { Box, Typography, CircularProgress, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 860, mx: "auto", width: "100%" }}>

        {/* ── Empty State ── */}
        {messages.length === 0 && !loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#d4956a",
                boxShadow: "0 0 40px rgba(212,149,106,0.3)",
                mb: 1,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 36 }} />
            </Avatar>

            <Typography
              variant="h5"
              fontWeight={700}
              color="text.primary"
              letterSpacing={-0.5}
            >
              How can I help you today?
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 380, lineHeight: 1.7 }}
            >
              Ask anything. I can understand text, transcribe your voice, read
              images via OCR, and extract content from PDF or DOCX files.
            </Typography>

            {/* Suggestion chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                justifyContent: "center",
                mt: 2,
              }}
            >
              {[
                "✍️  Summarize a document",
                "💡  Explain a concept",
                "🔍  Analyze text",
                "🧠  Solve a problem",
              ].map((chip) => (
                <Box
                  key={chip}
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: isLight ? "#ffffff" : "#1e1e1e",
                    border: isLight ? "1px solid #e0ddd8" : "1px solid #2e2e2e",
                    borderRadius: "20px",
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                    cursor: "default",
                    userSelect: "none",
                    "&:hover": {
                      bgcolor: isLight ? "#f5f2ed" : "#252525",
                      borderColor: isLight ? "#d0cdc8" : "#3e3e3e",
                      color: "text.primary",
                    },
                    transition: "all 0.15s ease",
                  }}
                >
                  {chip}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Messages ── */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* ── Typing indicator ── */}
        {loading && (
          <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "flex-start" }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#d4956a",
                boxShadow: "0 2px 8px rgba(212,149,106,0.35)",
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 17 }} />
            </Avatar>
            <Box
              sx={{
                bgcolor: isLight ? "#ffffff" : "#1e1e1e",
                border: isLight ? "1px solid #e8e8e8" : "1px solid #272727",
                borderRadius: "4px 16px 16px 16px",
                px: 2.5,
                py: 1.75,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={14} sx={{ color: "#d4956a" }} />
              <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                Thinking…
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>
    </Box>
  );
};

export default ChatWindow;