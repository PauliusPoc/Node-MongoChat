var socket = io();

$(() => {
	socket.on('disconnected', () => {
		$('#messages').append($('<li>').text('user disconnected'));
	});
});

(function() {
	//getting chat from database
	fetch('/chats')
		.then(data => {
			return data.json();
		})
		.then(json => {
			json.map(data => {
				let li = document.createElement('li');
				let messages = document.getElementById('messages');
				messages.appendChild(li).append(data.message);

				messages.append(`by: ${data.sender}: ${formatTimeAgo(data.date)}`);
			});
		});
})();

(function() {
	// sending a message
	$('form').submit(e => {
		let li = document.createElement('li');
		e.preventDefault();

		var msg = $('#m').val();
		msg = msg //avoiding js injection
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.trim();
		if (msg === '') return -1; //empty messages cannot be sent

		const token = localStorage.getItem('token').replace('Bearer ', '');
		console.log(parseJwt(token));
		const nickname = parseJwt(token).nickname;

		socket.emit('chat message', { token: token, msg: msg });
		//socket.emit('chat message', msg );
		messages.appendChild(li).append(msg);
		messages.append(`by ${nickname}: just now`);
		$('#m').val('');
		return false;
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
