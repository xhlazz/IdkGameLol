const socket = new WebSocket('ws://localhost:3001');
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const profileModal = document.getElementById('profileModal');

// Load user profile
const username = localStorage.getItem('selectedUser');
fetch(`http://localhost:3000/users/${username}`)
  .then((response) => response.json())
  .then((user) => {
    document.getElementById('profilePicture').src = user.profilePicture;
    document.getElementById('username').textContent = user.username;
    document.getElementById('description').textContent = user.description;
  });

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
  img.src = profilePicture;
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
    const profilePicture = document.getElementById('profilePicture').src;
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

// Edit profile
function editProfile() {
  profileModal.classList.remove('hidden');
}

function saveProfile() {
  const newDescription = document.getElementById('newDescription').value;
  const newProfilePictureInput = document.getElementById('newProfilePicture').files[0];

  if (newProfilePictureInput) {
    const reader = new FileReader();
    reader.onload = () => {
      const profilePicture = reader.result;
      fetch(`http://localhost:3000/users/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture, description: newDescription }),
      }).then(() => {
        document.getElementById('profilePicture').src = profilePicture;
        document.getElementById('description').textContent = newDescription;
        closeModal();
      });
    };
    reader.readAsDataURL(newProfilePictureInput);
  } else {
    fetch(`http://localhost:3000/users/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newDescription }),
    }).then(() => {
      document.getElementById('description').textContent = newDescription;
      closeModal();
    });
  }
}

function closeModal() {
  profileModal.classList.add('hidden');
}

// Exit chat
function exitChat() {
  window.location.href = 'index.html';
}