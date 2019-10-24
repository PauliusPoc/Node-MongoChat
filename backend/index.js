const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('./secret')();
const User = require('./models/User');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

const connect = require('./db');


const bodyParser = require('body-parser');
const chatRouter = require('./routers/chat');
const userRouter = require('./routers/user');
const authRouter = require('./routers/auth');

const auth = require('./middleware/auth');

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use('/chats', auth, chatRouter);
app.use('/users', auth, userRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 5000;

http.listen(PORT, 'localhost', () => {
	console.log(`Server listening on: ${PORT}`);
});

app.use(express.static(path.join(__dirname, '../frontend/src/')));

const dynamicNsp = /^\/\d+$/;

io.of(dynamicNsp, (nsp, query, next) => {
	console.log(nsp.nsp.name);
}).on('connection', socket => {
	socket.on('disconnect', () => {
		io.emit('disconnected');
		console.log('user disconnected');
	});
	socket.on('chat message', async data => {
        const token = data.token; //if empty error
        const room = data.room;
		const msg = data.msg;
		const user = await authSocket(token);

		socket.broadcast.to(room).emit('received', { nickname: user.nickname, msg: msg }); // broadcast.emit emits only for other connections
    });
    socket.on('join room', async room => {
        socket.join(room);
    })
    socket.on('leave room', async room => {
        socket.leave(room);
        socket.to(room).emit('user left', socket.id);
    })
});

async function authSocket(token) {
	console.log('tokenas' + token);
	const data = jwt.verify(token, JWT_KEY);
	const user = await User.findOne({ _id: data._id, 'tokens.token': token });
	if (!user) {
		throw new Error('Invalid token');
	}
	return user;
}


