#!/bin/bash

# Set the OpenAI API Key
export OPENAI_API_KEY="< your api key>"

# Optional: Print a confirmation message
echo "OPENAI_API_KEY is set to $OPENAI_API_KEY"

node /home/glitch/code/chatroom-apps/server.mjs
