const express = require('express');
const path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const Chat = require('./models/chat');
const connect = require('./db');

const bodyParser = require('body-parser');
const chatRouter = require('./route/chatRoute');

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use('/chats', chatRouter);



const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../frontend/src/')));

io.on('connection', socket => {
	console.log('user connected');
	socket.on('disconnect', () => {
        io.emit('disconnected');
		console.log('user disconnected');
    });
    socket.on('chat message', msg => {
        socket.broadcast.emit('received', msg);// broadcast.emit emits only for other connections

        connect.then(db => {

        let chatMessage = new Chat({message: msg, sender: "Anonymous"});
        chatMessage.save();
    });
    });



});

http.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});

//express.static()
