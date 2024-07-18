const socket = io();

function joinChat() {
    const nickname = document.getElementById('nickname').value;
    const room = document.getElementById('room').value;
    if (nickname) {
        socket.emit('add user', nickname, room);
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        document.getElementById('room-label').innerText = `Room: ${room}`;
    } else {
        document.getElementById('error').innerText = 'Nickname is required.';
    }
}

socket.on('login', (data) => {
    const roomSelect = document.getElementById('room');
    roomSelect.innerHTML = '';
    data.rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.innerText = room;
        roomSelect.appendChild(option);
    });
});

socket.on('new message', (data) => {
    displayMessage(data.nickname, data.message, data.timestamp);
});

socket.on('update users', (users) => {
    const userListContainer = document.getElementById('user-list');
    userListContainer.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('p');
        userElement.innerText = user;
        userListContainer.appendChild(userElement);
    });
});

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message.trim() !== '') {
        socket.emit('new message', message);
        document.getElementById('message').value = '';
    }
}

function displayMessage(nickname, message, timestamp = new Date().toLocaleTimeString()) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('p');
    messageElement.innerText = `${timestamp} ${nickname}: ${message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function exitChat() {
    socket.disconnect();
    document.getElementById('login').style.display = 'block';
    document.getElementById('chat').style.display = 'none';
}
