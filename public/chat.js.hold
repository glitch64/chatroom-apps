let socket;

// Event listener to join the chat when 'Enter' is pressed in the nickname input field
document.getElementById('nickname').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinChat();
});

// Function to join the chat room
function joinChat() {
    const nickname = document.getElementById('nickname').value;
    const room = document.getElementById('room').value;
    if (!nickname) {
        document.getElementById('error').textContent = 'Nickname is required.';
        return;
    }
    if (!socket || !socket.connected) {
        socket = io();
        socketListeners();
    }
    clearChatWindow();
    socket.emit('add user', nickname, room);
}

// Function to set up all socket event listeners
function socketListeners() {
    socket.on('login', (data) => {
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
        updateRoomsList(data.rooms);
    });

    socket.on('nickname error', (error) => {
        document.getElementById('error').textContent = error;
    });

    socket.on('user joined', (data) => {
        updateUserList(data.users);
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<p><strong>${data.nickname}</strong> joined the room.</p>`;
    });

    socket.on('new message', (data) => {
        console.log('Message sent');
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<p><strong>${data.nickname}</strong> [${data.timestamp}]: ${data.message}</p>`;
    });

    socket.on('user left', (data) => {
        updateUserList(data.users);
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<p><strong>${data.nickname}</strong> left the room.</p>`;
    });

    socket.on('update users', (users) => {
        updateUserList(users);
    });

    socket.on('private message', (msg) => {
        console.log('Private message from ' + msg.from + ': ' + msg.content);
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<p><strong>Private message from ${msg.from}</strong>: ${msg.content}</p>`;
    });
}

// Function to send a message to the chat room
function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        socket.emit('new message', message);
        document.getElementById('message').value = '';
    }
}

// Function to exit the chat room
function exitChat() {
    document.getElementById('chat').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    clearChatWindow();
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Function to update the list of active users in the room
function updateUserList(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `<p>${user}</p>`;
    });
}

// Function to update the list of available rooms
function updateRoomsList(rooms) {
    const roomSelect = document.getElementById('room');
    roomSelect.innerHTML = '';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        roomSelect.appendChild(option);
    });
}

// Function to clear the chat window
function clearChatWindow() {
    document.getElementById('chat-window').innerHTML = '';
}

// Function to send a private message to another user
function PrivateMessage() {
    const targetUsername = document.getElementById('private-username').value;
    const privateMessage = document.getElementById('private-message').value;
    if (targetUsername && privateMessage) {
        socket.emit('private message', { targetUsername, content: privateMessage });
        document.getElementById('private-message').value = '';
    }
}
