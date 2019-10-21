const express = require('express');
const path = require('path');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

const Chat = require('./models/Chat');
const connect = require('./db');



const bodyParser = require('body-parser');
const chatRouter = require('./routers/chat');
const userRouter = require('./routers/user')

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use('/chats', chatRouter);
app.use(userRouter);

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

http.listen(PORT, 'localhost', () => {
	console.log(`Server listening on: ${PORT}`);
});

//express.static()
