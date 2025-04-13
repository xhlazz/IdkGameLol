const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Database setup
mongoose.connect('mongodb://localhost:27017/xhlazzChat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profilePicture: String,
});
const User = mongoose.model('User', userSchema);

// Chat schema
const chatSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: Date,
});
const Chat = mongoose.model('Chat', chatSchema);

// Authentication
const JWT_SECRET = 'supersecretkey';
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: 'User not found' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: 'User registered successfully' });
});

// Start server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', async (data) => {
    const newMessage = new Chat({
      sender: data.sender,
      message: data.message,
      timestamp: new Date(),
    });
    await newMessage.save();

    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});