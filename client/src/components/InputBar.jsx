import { useState, useRef } from "react";
import {
  Box, TextField, IconButton, Tooltip, Paper, Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import Tesseract from "tesseract.js";

const InputBar = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef();
  const docInputRef = useRef();

  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported in this browser!");
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => {
      setMessage(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      setMessage(text.trim());
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    setUploading(true);
    try {
      if (ext === "csv" || ext === "txt") {
        const reader = new FileReader();
        reader.onload = (ev) => setMessage(ev.target.result);
        reader.readAsText(file);
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(
          "http://localhost:5000/api/extract",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage(res.data.text);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const isDisabled = disabled || uploading;

  // ── theme-aware colors ──
  const iconColor = isLight ? "#888888" : "#555555";
  const iconHoverBg = isLight ? "#f0ede8" : "#2a2a2a";
  const sendActiveBg = "#d4956a";
  const sendInactiveBg = isLight ? "#eeebe6" : "#252525";
  const sendInactiveColor = isLight ? "#bbbbbb" : "#444444";

  return (
    <Box sx={{ px: 2, pb: 4, pt: 2, width: "100%" }}>
      <Box sx={{ maxWidth: 860, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: isLight ? "#ffffff" : "#1e1e1e",
            borderRadius: "14px",
            border: isLight ? "1px solid #e0ddd8" : "1px solid #2e2e2e",
            p: 1.25,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:focus-within": {
              borderColor: "#d4956a",
              boxShadow: "0 0 0 3px rgba(212,149,106,0.12)",
            },
          }}
        >
          {/* Text input */}
          <TextField
            multiline
            maxRows={8}
            fullWidth
            placeholder={uploading ? "Extracting content…" : "Message Kishanth AI…"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              px: 1,
              "& .MuiInputBase-root": { alignItems: "flex-start" },
              "& .MuiInputBase-input": {
                color: isLight ? "#1a1a1a" : "#ececec",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                "&::placeholder": {
                  color: isLight ? "#aaaaaa" : "#555555",
                  opacity: 1,
                },
              },
            }}
          />

          {/* Actions row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}>

            {/* Left: tool buttons */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title={listening ? "Listening…" : "Voice input"} placement="top">
                <span>
                  <IconButton size="small" onClick={handleVoice} disabled={isDisabled}
                    sx={{
                      color: listening ? "#d4956a" : iconColor,
                      "&:hover": { color: "#d4956a", bgcolor: iconHoverBg },
                    }}>
                    {listening ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Upload image (OCR)" placement="top">
                <span>
                  <IconButton size="small" onClick={() => imageInputRef.current.click()} disabled={isDisabled}
                    sx={{
                      color: iconColor,
                      "&:hover": { color: "#d4956a", bgcolor: iconHoverBg },
                    }}>
                    <ImageIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <input ref={imageInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleImageUpload} />

              <Tooltip title="Upload document (PDF, DOCX, CSV, TXT)" placement="top">
                <span>
                  <IconButton size="small" onClick={() => docInputRef.current.click()} disabled={isDisabled}
                    sx={{
                      color: iconColor,
                      "&:hover": { color: "#d4956a", bgcolor: iconHoverBg },
                    }}>
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <input ref={docInputRef} type="file"
                accept=".pdf,.docx,.csv,.txt,.xls,.xlsx"
                style={{ display: "none" }} onChange={handleDocUpload} />
            </Box>

            {/* Right: Send button */}
            <Tooltip title="Send (Enter)" placement="top">
              <span>
                <IconButton
                  size="small"
                  onClick={handleSend}
                  disabled={!message.trim() || isDisabled}
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: message.trim() && !isDisabled ? sendActiveBg : sendInactiveBg,
                    color: message.trim() && !isDisabled ? "#fff" : sendInactiveColor,
                    "&:hover": {
                      bgcolor: message.trim() && !isDisabled ? "#bc7d52" : sendInactiveBg,
                    },
                    "&.Mui-disabled": {
                      bgcolor: sendInactiveBg,
                      color: sendInactiveColor,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <SendIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>

        <Typography variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1.25,
            color: isLight ? "#aaaaaa" : "#3e3e3e",
            fontSize: "0.72rem",
          }}
        >
          Kishanth AI can make mistakes. Consider checking important information.
        </Typography>
      </Box>
    </Box>
  );
};

export default InputBar;