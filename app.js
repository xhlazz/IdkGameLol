const socket = new WebSocket('ws://localhost:3001');
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Load user profile
const profilePicture = localStorage.getItem('profilePicture') || 'default-profile.png';
const username = localStorage.getItem('username') || 'Anonymous';
document.getElementById('profilePicture').src = profilePicture;
document.getElementById('username').textContent = username;

// Fetch existing messages
fetch('http://localhost:3000/messages')
  .then((response) => response.json())
  .then((messages) => {
    messages.forEach((message) => {
      addMessage(message.message, message.sender, message.profilePicture, message.timestamp);
    });
  });

// Add a message to the chat container
function addMessage(message, sender, profilePicture, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  
  const img = document.createElement('img');
  img.src = profilePicture || 'default-profile.png';
  img.classList.add('message-profile-picture');
  
  const content = document.createElement('div');
  const time = new Date(timestamp).toLocaleTimeString();
  content.innerHTML = `<strong>${sender}</strong> <small>${time}</small>: ${message}`;
  
  messageDiv.appendChild(img);
  messageDiv.appendChild(content);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send a message
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const messageData = {
      sender: username,
      message,
      profilePicture,
      timestamp: new Date(),
    };
    socket.send(JSON.stringify(messageData));
    addMessage(message, username, profilePicture, messageData.timestamp);
    messageInput.value = '';
  }
});

// Receive messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  addMessage(data.message, data.sender, data.profilePicture, data.timestamp);
});

// Exit chat
function exitChat() {
  window.location.href = 'index.html';
}
