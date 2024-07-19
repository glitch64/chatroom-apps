#!/bin/bash

# Set the OpenAI API Key
export OPENAI_API_KEY="sk-proj-9bzUjfla16LDhaEZQaCNT3BlbkFJ9XdoTew3RkDhtN72ryt1"

# Optional: Print a confirmation message
echo "OPENAI_API_KEY is set to $OPENAI_API_KEY"

node /home/glitch/code/chatroom-apps/server.mjs
