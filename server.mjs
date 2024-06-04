import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 3000;
const users = []; // Declare the users array

app.use(express.static(path.join(__dirname, 'public')));

let nicknames = {};
let rooms = ['Lobby', 'Room #1', 'Room #2', 'Room #3', 'Room #4', 'Room #5', 'Room #6', 'Room #7', 'Room #8', 'Room #9'];

io.on('connection', (socket) => {
    let addedUser = false;

    // Event listener for adding a user to a room
    socket.on('add user', (nickname, room) => {
        if (addedUser) return;

        if (Object.values(nicknames).includes(nickname)) {
            socket.emit('nickname error', 'Nickname already in use.');
            return;
        }

        socket.nickname = nickname;
        socket.room = room;
        nicknames[socket.id] = nickname;
        addedUser = true;

        // Add user to the users array
        users.push({ socketId: socket.id, username: nickname });

        socket.join(room);
        socket.emit('login', { rooms });

        const usersInRoom = getUsersInRoom(room);
        io.to(room).emit('user joined', {
            nickname: socket.nickname,
            users: usersInRoom
        });
        io.to(room).emit('update users', usersInRoom);
    });

    // Event listener for sending a new message
    socket.on('new message', (message) => {
        io.to(socket.room).emit('new message', {
            nickname: socket.nickname,
            message,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    // Event listener for switching rooms
    socket.on('switch room', (newRoom) => {
        socket.leave(socket.room);
        socket.join(newRoom);
        socket.room = newRoom;

        const usersInNewRoom = getUsersInRoom(newRoom);
        io.to(newRoom).emit('user joined', {
            nickname: socket.nickname,
            users: usersInNewRoom
        });
        io.to(newRoom).emit('update users', usersInNewRoom);
    });

    // Event listener for user disconnection
    socket.on('disconnect', () => {
        if (addedUser) {
            const room = socket.room;
            delete nicknames[socket.id];

            // Remove user from the users array
            const index = users.findIndex(user => user.socketId === socket.id);
            if (index !== -1) {
                users.splice(index, 1);
            }

            const usersInRoom = getUsersInRoom(room);
            io.to(room).emit('user left', {
                nickname: socket.nickname,
                users: usersInRoom
            });
            io.to(room).emit('update users', usersInRoom);
        }
    });

    // Event listener for private messages
    socket.on('private message', (msg) => {
        console.log('private message received on server.', msg, msg.targetUsername);
        const targetUser = users.find(user => user.username === msg.targetUsername);
        console.log('targetUser = ', targetUser);
        if (targetUser) {
            io.to(targetUser.socketId).emit('private message', {
                from: socket.nickname, // Make sure to use socket.nickname
                content: msg.content
            });
        }
    });
});

// Function to get the list of users in a room
function getUsersInRoom(room) {
    const usersInRoom = [];
    const clients = io.sockets.adapter.rooms.get(room) || [];
    clients.forEach(clientId => {
        usersInRoom.push(nicknames[clientId]);
    });
    return usersInRoom;
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
