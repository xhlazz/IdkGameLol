const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/chaty", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
});
const User = mongoose.model("User", userSchema);

// Chat Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: Date,
});
const Message = mongoose.model("Message", messageSchema);

// JWT Secret
const JWT_SECRET = "supersecretkey";

// Authentication Routes
app.post("/register", async (req, res) => {
  const { username, password, avatar } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword, avatar });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// WebSocket for Real-time Messaging
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing messages to the new user
  socket.on("get_messages", async () => {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit("load_messages", messages);
  });

  // Handle incoming messages
  socket.on("send_message", async (data) => {
    const newMessage = new Message({
      sender: data.sender,
      message: data.message,
      timestamp: new Date(),
    });
    await newMessage.save();

    io.emit("receive_message", newMessage); // Broadcast to all users
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
