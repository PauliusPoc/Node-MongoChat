const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('./secret')();
const User = require('./models/User');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


const Chat = require('./models/Chat');
const connect = require('./db');

const bodyParser = require('body-parser');
const chatRouter = require('./routers/chat');
const userRouter = require('./routers/user')
const auth = require('./middleware/auth');

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
    socket.on('chat message', async (data) => {
        const token = data.token; //if empty error
        const msg = data.msg
        const user = await authSocket(token);
        
        socket.broadcast.emit('received', {nickname: user.nickname , msg : msg});// broadcast.emit emits only for other connections
        connect.then(db => {
        let chatMessage = new Chat({message: msg, sender: user.nickname});
        chatMessage.save();
    });
    });
});

async function authSocket(token) {
    const data = jwt.verify(token, JWT_KEY)
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
        throw new Error('Invalid token');
    }
    return user;
};


http.listen(PORT, 'localhost', () => {
	console.log(`Server listening on: ${PORT}`);
});
