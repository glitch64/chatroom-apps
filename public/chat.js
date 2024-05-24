let socket;

document.getElementById('nickname').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinChat();
});

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
}

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        socket.emit('new message', message);
        document.getElementById('message').value = '';
    }
}

function exitChat() {
    document.getElementById('chat').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    clearChatWindow();
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

function updateUserList(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `<p>${user}</p>`;
    });
}

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

function clearChatWindow() {
    document.getElementById('chat-window').innerHTML = '';
}
