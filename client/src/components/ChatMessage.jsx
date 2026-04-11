import { Box, Avatar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 1,
        mb: 4,
        alignItems: "flex-start",
        animation: "fadeSlideIn 0.25s ease",
        "@keyframes fadeSlideIn": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 30,
          height: 30,
          bgcolor: isUser ? "#4a5bc4" : "#d4956a",
          boxShadow: isUser
            ? "0 2px 8px rgba(74,91,196,0.35)"
            : "0 2px 8px rgba(212,149,106,0.35)",
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 17 }} />
        ) : (
          <AutoAwesomeIcon sx={{ fontSize: 17 }} />
        )}
      </Avatar>

      {/* Content */}
      <Box sx={{ maxWidth: "89%", display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {isUser ? "You" : "Kishanth AI"}
        </Typography>

        <Box
          sx={{
            bgcolor: isUser
              ? isLight ? "#eeecf8" : "#2a2a3e"
              : isLight ? "#ffffff" : "#1e1e1e",
            border: isUser
              ? isLight ? "1px solid #d0cce8" : "1px solid #363660"
              : isLight ? "1px solid #e8e8e8" : "1px solid #272727",
            borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
            px: 2.5,
            py: 1.75,

            // ── markdown prose styles ──
            "& p": { m: 0, mb: 0.75 },
            "& p:last-child": { mb: 0 },
            "& ul, & ol": { pl: 2.5, mb: 0.5 },
            "& li": { mb: 0.25 },
            "& h1, & h2, & h3": {
              mt: 1.5, mb: 0.75,
              color: isLight ? "#1a1a1a" : "#ececec",
            },
            "& blockquote": {
              borderLeft: "3px solid #d4956a",
              pl: 2, ml: 0,
              color: isLight ? "#777777" : "#9a9a9a",
            },
            "& strong": { color: isLight ? "#1a1a1a" : "#ececec" },

            // ── inline code (non-block) ──
            "& code": {
              bgcolor: isLight ? "#eeecf8" : "#1a1a2e",
              px: 0.75, py: 0.25,
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              color: "#d4956a",
            },
          }}
        >
          {isUser ? (
            <Typography
              variant="body1"
              sx={{
                color: isLight ? "#2a2860" : "#e0e0f5",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                fontSize: "0.9375rem",
              }}
            >
              {message.content}
            </Typography>
          ) : (
            <Box sx={{ color: isLight ? "#1a1a1a" : "#dcdcdc", fontSize: "0.9375rem", lineHeight: 1.8 }}>
              <ReactMarkdown
                components={{
                  // ── Syntax highlighted code blocks ──
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "text";

                    return !inline ? (
                      <Box sx={{ my: 1.5, borderRadius: "10px", overflow: "hidden",
                        border: isLight ? "1px solid #e0ddd8" : "1px solid #2e2e2e" }}>
                        {/* Language label */}
                        <Box sx={{
                          px: 2, py: 0.75,
                          bgcolor: isLight ? "#f0ede8" : "#2a2a2a",
                          borderBottom: isLight ? "1px solid #e0ddd8" : "1px solid #2e2e2e",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <Typography sx={{ fontSize: "0.72rem", color: isLight ? "#888" : "#666",
                            fontFamily: "monospace", textTransform: "lowercase" }}>
                            {language}
                          </Typography>
                        </Box>

                        {/* Highlighted code */}
                        <SyntaxHighlighter
                          style={isLight ? oneLight : oneDark}
                          language={language}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            fontSize: "0.82rem",
                            lineHeight: 1.6,
                            background: isLight ? "#faf9f6" : "#141414",
                            borderRadius: 0,
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </Box>
                    ) : (
                      // inline code
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;