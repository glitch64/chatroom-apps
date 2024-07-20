Web Chatroom application. 
NodeJS application using: express, http, socket.io, axios, url, path, fs
 
Description:

A Chatrooms application.

Chat Application prompts visitor for a nickname and a room to join.  
Application will check existing active connections of users and not allow you to pick a nickname currently active.
Visitors select from a drop down list of chat rooms.  There are 11 rooms:

LOBBY
ROOMS 1-9
ChatGPT - openai-api to tuned chatgpt3.5 turbo LLM.  Enter the ChatGPT room to send prompts to it.

![image](https://github.com/glitch64/chatroom-apps/assets/6064068/e1e5b7e0-eab4-4da8-a68c-f6c183d43f3d)

Chat rooms have an ACTIVE USERS IN ROOM listing of all visitors currently in the room.
To chat, visitors, type a message in the message text box and click the SEND button.

![image](https://github.com/glitch64/chatroom-apps/assets/6064068/93cc3008-7936-4a2f-bc56-48b18a427a5a)

To exit the current room and return to the main page, visitors click the exit button and are returned to the select room page.
Note:  Currently chatroom-apps does not retain a chat history.  next update will include MySQL database storage of text history.

Updated:  A basic private chat message feature has been added.
Next update:  Will update private chat to either require a selection from a drop-down list, or some other method. 

Installation:
1. mkdir chatroom-apps
2. git clone https://github.com/glitch64/chatroom-apps.git
3. cd to chatroom-apps folder
4. create cgkey.sh and chatroom.sh files:
   ```
   Enter following to cgkey.sh:
   echo "export OPENAI_API_KEY='### your openai API Key ####'"
   Enter following to chatroom.sh: 
   export OPENAI_API_KEY="### your openai API Key ####"
   ```
5. npm update
6. npm install




