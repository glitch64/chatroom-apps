#!/bin/bash

# Set the OpenAI API Key
export OPENAI_API_KEY="sk-None-o1x9KsurPWIUCK9JYuIST3BlbkFJgd9NLkTob89lq8cTAkR3"

# Optional: Print a confirmation message
echo "OPENAI_API_KEY is set to $OPENAI_API_KEY"

node /home/glitch/code/chatroom-apps/server.mjs
