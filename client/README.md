# Kishanth AI — Frontend

A modern AI chat interface built with React + Material UI, powered by Google Gemini 2.5 Flash.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Material UI (MUI) | Component library |
| Axios | HTTP requests |
| React Markdown | Render AI markdown responses |
| React Syntax Highlighter | Code block syntax highlighting |
| Tesseract.js | Image OCR text extraction |
| Vite | Build tool |

---

## Project Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ChatMessage.jsx     # Individual message bubble (user + AI)
│   │   ├── ChatWindow.jsx      # Message list + empty state + typing indicator
│   │   ├── InputBar.jsx        # Text input, voice, image, file upload
│   │   └── Sidebar.jsx         # Conversation list, search, delete, theme toggle
│   ├── pages/
│   │   └── ChatPage.jsx        # Main page — wires all components together
│   ├── App.jsx                 # Theme provider + dark/light mode state
│   ├── theme.js                # MUI theme config (dark + light)
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### 1. Install dependencies
```bash
cd client
npm install
```

### 2. Start the development server
```bash
npm run dev
```

App runs at `http://localhost:5173`

> Make sure the backend server is running on port 5000 before starting the frontend.

---

## Features

### Chat
- Send messages and get AI responses from Gemini 2.5 Flash
- Markdown rendering with syntax highlighted code blocks
- Smooth scroll to latest message
- Typing indicator while AI is responding

### Sidebar
- View all saved conversations from MongoDB
- Click any conversation to load its full history
- Delete conversations (hover to reveal delete button)
- Search conversations by title
- Dark / Light mode toggle (sun/moon icon)

### Input Bar
- Multi-line text input (Shift+Enter for new line, Enter to send)
- Voice input via Web Speech API
- Image upload with OCR (Tesseract.js extracts text from images)
- File upload support: PDF, DOCX, CSV, TXT, XLS, XLSX

### Theme
- Dark mode (default) — deep dark grey tones
- Light mode — warm beige/white tones inspired by Claude
- Toggle persists within session

---

## Environment

No `.env` file needed for the frontend. The backend URL is set directly in the code:

```
http://localhost:5000
```

To change this for production, update the axios base URLs in:
- `ChatPage.jsx`
- `InputBar.jsx`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Dependencies

```json
"dependencies": {
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "axios": "^1.x",
  "react-markdown": "^9.x",
  "react-syntax-highlighter": "^15.x",
  "tesseract.js": "^5.x",
  "react": "^18.x",
  "react-dom": "^18.x"
}
```

Install all with:
```bash
npm install
```