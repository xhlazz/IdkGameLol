const WebSocket = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chaty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  profilePicture: String,
  description: String,
});
const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  profilePicture: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Seed database with default profiles
(async function seedDatabase() {
  const users = [
    { username: 'xhlazz', profilePicture: 'path/to/xhlazz-photo.jpg', description: 'The one and only xhlazz!' },
    { username: 'Mikunef', profilePicture: 'path/to/mikunef-photo.jpg', description: 'Mikunef, the vocaloid fan!' },
  ];

  for (const user of users) {
    const existingUser = await User.findOne({ username: user.username });
    if (!existingUser) {
      await User.create(user);
    }
  }
})();

const app = express();
app.use(cors());
app.use(express.json());

// Fetch all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Fetch user profile
app.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
app.put('/users/:username', async (req, res) => {
  try {
    const { profilePicture, description } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { profilePicture, description },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Start WebSocket server
const server = new WebSocket.Server({ port: 3001 });

server.on('connection', (socket) => {
  console.log('User connected');

  // Handle incoming messages
  socket.on('message', async (data) => {
    const messageData = JSON.parse(data);

    // Save message to database
    const newMessage = new Message(messageData);
    await newMessage.save();

    // Broadcast message to all clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    });
  });

  socket.on('close', () => {
    console.log('User disconnected');
  });
});

// Start Express server
app.listen(3000, () => {
  console.log('Express server running on http://localhost:3000');
});