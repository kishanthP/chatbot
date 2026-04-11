# Kishanth AI — Backend

A Node.js + Express REST API that handles AI chat via Google Gemini, file text extraction, and MongoDB conversation storage.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| Google Gemini API | AI model (gemini-2.5-flash) |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |
| express-fileupload | File upload middleware |
| dotenv | Environment variables |
| cors | Cross-origin requests |

---

## Project Structure

```
server/
├── config/
│   └── db.js                       # MongoDB connection
├── controllers/
│   ├── chatController.js           # Handles chat requests → calls Gemini + saves to DB
│   ├── conversationController.js   # CRUD operations for conversations
│   └── extractController.js        # PDF + DOCX text extraction
├── models/
│   └── Conversation.js             # Mongoose schema (title, messages[])
├── routes/
│   ├── chat.js                     # POST /api/chat
│   ├── conversationRoutes.js       # GET/DELETE /api/conversations
│   └── extract.js                  # POST /api/extract
├── services/
│   ├── conversationService.js      # DB logic (create, update, search, delete)
│   └── geminiService.js            # Gemini API call with retry logic
├── .env                            # Environment variables (not committed)
├── index.js                        # Entry point
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Create `.env` file
Create a `.env` file in the `server/` folder:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/chatbot?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Make sure `dotenv.config()` is the **very first line** in `index.js`

### 3. Start the server
```bash
node index.js
```

Server runs at `http://localhost:5000`

You should see:
```
✅ Server running on port 5000
✅ MongoDB Connected
```

---

## API Endpoints

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message, get AI reply, save to DB |

**Request body:**
```json
{
  "message": "Hello, explain React hooks",
  "conversationId": "64abc123..." 
}
```
> `conversationId` is optional — omit it to start a new conversation

**Response:**
```json
{
  "content": "React hooks are...",
  "conversationId": "64abc123..."
}
```

---

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get all conversations (title + date only) |
| GET | `/api/conversations/:id` | Get single conversation with all messages |
| DELETE | `/api/conversations/:id` | Delete a conversation |
| GET | `/api/conversations/search?q=react` | Search conversations by title |

---

### File Extraction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extract` | Extract text from PDF or DOCX file |

**Request:** `multipart/form-data` with field `file`

**Response:**
```json
{
  "text": "Extracted text content..."
}
```

---

## MongoDB Schema

### Conversation
```javascript
{
  title: String,           // First 50 chars of first user message
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      timestamp: Date
    }
  ],
  createdAt: Date,         // Auto (mongoose timestamps)
  updatedAt: Date          // Auto (mongoose timestamps)
}
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key from [Google AI Studio](https://aistudio.google.com) |

---

## Getting a Gemini API Key

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Copy and paste into your `.env` file

Free tier limit: **10 requests/minute**

---

## Getting MongoDB Atlas URI

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Go to **Security → Database Access** → Create a user
4. Go to **Security → Network Access** → Add your IP
5. Click **"Connect"** on your cluster → **"Drivers"** → Copy the URI
6. Replace `<password>` with your actual password

> ⚠️ Avoid special characters like `@` in your password — use `%40` or choose a simpler password

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `node index.js` | Start server |
| `nodemon index.js` | Start with auto-restart on changes |

Install nodemon globally for development:
```bash
npm install -g nodemon
```

---

## Dependencies

```json
"dependencies": {
  "express": "^4.x",
  "mongoose": "^8.x",
  "cors": "^2.x",
  "dotenv": "^16.x",
  "express-fileupload": "^1.x",
  "pdf-parse": "^1.x",
  "mammoth": "^1.x"
}
```

Install all with:
```bash
npm install
```