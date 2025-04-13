const socket = new WebSocket('ws://localhost:3001'); // WebSocket server URL
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const username = localStorage.getItem('selectedUser');

// Display the username in the chat header
document.getElementById('username').textContent = `Welcome, ${username}`;

// Add a message to the chat container
function addMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  if (sender === username) messageDiv.classList.add('self');
  messageDiv.textContent = `${sender}: ${message}`;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send a message
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(JSON.stringify({ sender: username, message }));
    addMessage(message, username);
    messageInput.value = '';
  }
});

// Receive messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  addMessage(data.message, data.sender);
});

// Exit chat and return to user selection
function exitChat() {
  localStorage.removeItem('selectedUser');
  window.location.href = 'index.html';
}