#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the specific Node.js version
nvm use 22.4.1

# Start the Node.js application
/root/.nvm/versions/node/v22.4.1/bin/node /home/glitch/code/chatroom-apps/server.mjs

