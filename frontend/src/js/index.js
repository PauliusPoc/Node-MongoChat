var socket = io();

$(() => {
	socket.on('disconnected', () => {
		$('#messages').append($('<li>').text('user disconnected'));
	});
});

(function() { //getting chat from database
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

(function() { // sending a message
	$('form').submit(e => {
		let li = document.createElement('li');
		e.preventDefault();

		var msg = $('#m').val();
		msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); //avoiding js injection
		if (msg === "") return -1; //empty messages cannot be sent 

		socket.emit('chat message', $('#m').val());
		messages.appendChild(li).append($('#m').val());
		messages.append(`by Anonymous: just now`);
		$('#m').val('');
		return false;
	});
})();

(function() { // receiving a message
	socket.on('received', data => { 
		
		data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
		if (data === "") return -1; //empty messages cannot be sent

		let li = document.createElement('li');
		var messages = document.getElementById('messages');
		messages.appendChild(li).append(data);
		messages.append(`by Anonymous: just now`);
	});
})();
