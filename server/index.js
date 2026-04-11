const dotenv = require("dotenv");
dotenv.config(); // ← MUST be first before anything else

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const conversationRoutes = require("./routes/conversationRoutes");

connectDB(); // ← Now MONGO_URI is available

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/api/chat", require("./routes/chat"));
app.use("/api/extract", require("./routes/extract"));
app.use("/api/conversations", conversationRoutes);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));