const WebSocket = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chaty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  profilePicture: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
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