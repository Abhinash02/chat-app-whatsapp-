const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const initializeSocket = require("./socket");

// Import schemas
require("./models/Message");
require("./models/Group");
require("./models/User");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Authentication routes
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Chat app backend running");
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Initialize Socket.IO
initializeSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});