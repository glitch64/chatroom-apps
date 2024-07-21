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

// Path to the system instructions file
const systemInstructionsPath_system_science_and_programmer_expert = join(__dirname, 'system_instruction_science_and_programmer_expert.txt');
const systemInstructionsPath_ancient_history_expert = join(__dirname, 'system_instruction_ancient_history_expert.txt');

// Read the system instructions from the file
const SYSTEM_PROMPT_SCIENCE_AND_PROGRAMMER_EXPERT = fs.readFileSync(systemInstructionsPath_system_science_and_programmer_expert, 'utf-8');
const SYSTEM_PROMPT_ANCIENT_HISTORY_EXPERT = fs.readFileSync(systemInstructionsPath_ancient_history_expert, 'utf-8');

// Verify that index.html exists at the expected location
const indexPath = join(__dirname, 'public', 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error(`Error: ${indexPath} does not exist.`);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};// object to store users by room

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
        if (socket.room && socket.nickname) {
            const roomUsers = users[socket.room] || [];
            const index = roomUsers.indexOf(socket.nickname);
            if (index !== -1) {
                roomUsers.splice(index, 1);
                users[socket.room] = roomUsers;
                io.to(socket.room).emit('update users', roomUsers);
            }
        }
	console.log('user disconnected');
    });

    socket.on('new message', async (message) => {
        // Broadcast user message to all clients in the room
        io.to(socket.room).emit('new message', {
            nickname: socket.nickname,
            message: message,
            timestamp: new Date().toLocaleTimeString(),
        });
        if (socket.room === 'Science and Programmer Expert') {
            try {
                const response = await axios.post(
                    OPENAI_API_URL,
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT_SCIENCE_AND_PROGRAMMER_EXPERT},
                            { role: 'user', content: `${socket.nickname}: ${message}` }
                        ],
                        temperature: 1.0,
                        max_tokens: 1000,
                        top_p: 1,
                        frequency_penalty: 0.0,
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
                    nickname: 'Science and Programming Expert',
                    message: reply,
                    timestamp: new Date().toLocaleTimeString(),
                });
            } catch (error) {
                console.error('Error with OpenAI API:', error);
            }
        }

        if (socket.room === 'Ancient History Expert') {
            try {
                const response = await axios.post(
                    OPENAI_API_URL,
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT_ANCIENT_HISTORY_EXPERT},
                            { role: 'user', content: `${socket.nickname}: ${message}`  }
                        ],
                        temperature: 0.7,
                        max_tokens: 2000,
                        top_p: 1,
                        frequency_penalty: 0.0,
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
                    nickname: 'Ancient History Expert',
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

        // Add user to the room's user list
        if (!users[room]) {
            users[room] = [];
        }
        users[room].push(nickname);
	    
	console.log(`${nickname} joined room ${room}`);
        io.to(socket.room).emit('new message', {
            nickname: 'System',
            message: `${nickname} has joined the room.`,
            timestamp: new Date().toLocaleTimeString(),
        });
        // Emit updated user list
        io.to(socket.room).emit('update users', users[room]);	    
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

