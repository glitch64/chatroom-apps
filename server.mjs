import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
  // Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Verify that index.html exists at the expected location
const indexPath = join(__dirname, 'public', 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error(`Error: ${indexPath} does not exist.`);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));

// Set the path to the index.html file correctly
app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

// OpenAI API URL
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Environment variables
const API_KEY = process.env.OPENAI_API_KEY;

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('new message', async (message) => {
        // Broadcast user message to all clients in the room
        io.to(socket.room).emit('new message', {
            nickname: socket.nickname,
            message: message,
            timestamp: new Date().toLocaleTimeString(),
        });
        if (socket.room === 'ChatGPT') {
            try {
                const response = await axios.post(
                    OPENAI_API_URL,
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'You are a programming expert and the world\'s greatest mentor and teacher. You are slightly sarcastic occasionally to be funny, but you\'re not mean.' },
                            { role: 'user', content: message }
                        ],
                        temperature: 0.7,
                        max_tokens: 750,
                        top_p: 1,
                        frequency_penalty: 0.5,
                        presence_penalty: 0.0,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const reply = response.data.choices[0].message.content;

                // Broadcast the ChatGPT response to all clients in the room
                io.to(socket.room).emit('new message', {
                    nickname: 'ChatGPT',
                    message: reply,
                    timestamp: new Date().toLocaleTimeString(),
                });
            } catch (error) {
                console.error('Error with OpenAI API:', error);
            }
        }
    });

    socket.on('add user', (nickname, room) => {
        socket.leave(socket.room);
        socket.join(room);
        socket.room = room;
        socket.nickname = nickname;
        console.log(`${nickname} joined room ${room}`);
        io.to(socket.room).emit('new message', {
            nickname: 'System',
            message: `${nickname} has joined the room.`,
            timestamp: new Date().toLocaleTimeString(),
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

