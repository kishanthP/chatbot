const dotenv = require("dotenv");
dotenv.config(); // ← MUST be first before anything else

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const conversationRoutes = require("./routes/conversationRoutes");
const authMiddleware = require("./middleware/authMiddleware");

connectDB(); // ← Now MONGO_URI is available

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Auth routes (public — no middleware)
app.use("/api/auth", require("./routes/auth"));

// Protected routes — require valid Firebase ID token
app.use("/api/chat", authMiddleware, require("./routes/chat"));
app.use("/api/extract", authMiddleware, require("./routes/extract"));
app.use("/api/conversations", authMiddleware, conversationRoutes);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));