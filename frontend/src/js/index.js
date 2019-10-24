let socketId = '';

let socket = io(`/1`);
socket.connect();

console.log(socket);

async function getSocketID(id, type = 'private') {
	console.log('id ' + id);
	const token = localStorage.getItem('token').replace('Bearer ', '');

	let response = '';

	if (type == 'private') {
		response = await fetch(`/chats/private/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});
	} else {
		response = await fetch(`/chats/group/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});
	}

	const data = await response.json();
	console.log(data);
	console.log('response ' + data); // TODO : check if i should return only ID
	// rename data

	if (socketId != data) {
		socket.emit('leave room', socketId);
		socketId = data;
		socket.emit('join room', socketId);
		await FetchMessages();
	}
}

$(() => {
	socket.on('disconnected', () => {
		$('#messages').append($('<li>').text('user disconnected'));
	});
});

async function FetchMessages() {
	//getting chat from database
	console.log('fetching');
	const token = localStorage.getItem('token');
	const response = await fetch(`/chats/${socketId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});
	const data = await response.json();
	console.log(data);

	let root = document.getElementById('messages');
	while (root.firstChild) {
		root.removeChild(root.firstChild);
	}

	data.messages.forEach(item => {
		let li = document.createElement('li');
		let messages = document.getElementById('messages');
		messages.appendChild(li).append(item.message);
		messages.append(`by: ${item.sender}: ${formatTimeAgo(item.date)}`);
	});
}

(async function() {
	//getting users and groupchats from database
	const token = localStorage.getItem('token');
	const users = await fetch('/users/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});

	const chats = await fetch('/chats/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});

	const data = await users.json();
	const chat = await chats.json();
	usrid = parseJwt(token)._id;

	//console.log(data);
	data.map(data => {
		let li = document.createElement('li');
		let userList = document.getElementById('users');
		li.setAttribute('id', data._id);
		li.setAttribute('onClick', 'getSocketID(this.id)');
		if (usrid != data._id) {
			userList.appendChild(li).append(data.nickname);
		}
		//userList.append(`by: ${data.sender}: ${formatTimeAgo(data.date)}`);
	});

	chat.map(data => {
		let li = document.createElement('li');
		let chatList = document.getElementById('groups');
		li.setAttribute('id', data._id);
		li.setAttribute('onClick', "getSocketID(this.id, 'group')");
		chatList.appendChild(li).append(data.name);
		//userList.append(`by: ${data.sender}: ${formatTimeAgo(data.date)}`);
	});
})();

(function() {
	// sending a message
	$('#msgform').submit(async e => {
		let li = document.createElement('li');
		e.preventDefault();
		console.log("message");

		var msg = $('#m').val();
		msg = msg //avoiding js injection
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.trim();
		if (msg === '') return -1; //empty messages cannot be sent

		const token = localStorage.getItem('token').replace('Bearer ', '');
		const response = await fetch('/chats/newMessage', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization : token
			},
			body: JSON.stringify({msg : msg, chatId : socketId})
		})

		if(response.status == 201){
			const _id = socketId;
			socket.emit('chat message', {
				_id: _id,
				token: token,
				msg: msg,
				room: socketId
			});
		}

		const nickname = parseJwt(token).nickname;
		messages.appendChild(li).append(msg);
		messages.append(`by ${nickname}: just now`);
		$('#m').val('');
		return false;
	});
})();

(function() {
	// Changin username
	$('#nickname_form').submit(async e => {
		let li = document.createElement('li');
		e.preventDefault();
		console.log("nickneimas");

		var msg = $('#nickname').val();
		msg = msg //avoiding js injection
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.trim();
		if (msg === '') return -1; //empty messages cannot be sent
		
		const mesag = JSON.stringify(msg);
		console.log(mesag);

		const token = localStorage.getItem('token');
		const response = await fetch('/users/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization : token
			},
			body: JSON.stringify({username : msg})
			
		})
		let res = await response.json()
		const newToken = res.token;
		console.log(res);
		console.log(newToken);
		localStorage.setItem('token', 'Bearer ' + newToken);
		document.getElementById('windowTitle').textContent = parseJwt(newToken).nickname;
	});
})();


(function() {
	// receiving a message
	socket.on('received', data => {
		data.msg = data.msg
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.trim();
		if (data.msg === '') return -1; //empty messages cannot be displayed

		let li = document.createElement('li');
		var messages = document.getElementById('messages');
		messages.appendChild(li).append(data.msg);
		messages.append(`by ${data.nickname}: just now`);
	});
})();

const parseJwt = token => {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
};
