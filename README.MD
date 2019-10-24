Chat application with Node.JS, Mongoose, Express and Socket.io
==================================

I have attached frontend to this HTTP API to demonstrate it better.
Frontend is intended to be used only on large screens.


Getting Started
---------------

```sh
# Go to backend directory
cd backend

# Install dependencies
npm install

# Start development live-reload server
npm run dev
```

Additional info
----------------

Endpoints not included in frontend:
```sh
POST:

/users/me/logout  

/users/me/logoutall

/chats/
# Creates new group chat
{
	"name" : "GrupinisChatas"
}

PUT 
/chats/:chatId 
#Adds user to chat

{
	"_id" : "userYouWantToAddId",
	"name" : "GroupChatName"
}
```




