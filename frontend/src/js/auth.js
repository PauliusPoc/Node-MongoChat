(function() { //  login POST
	$('#loginform').submit(async e => {
		console.log(e);
		
		e.preventDefault();

		var email = $('#email').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
		var password = $('#password').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
		const response = await fetch('/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		let res = await response.json()
		localStorage.setItem('token', 'Bearer ' + res.token);
		if(response.status == 200){
			window.location.replace("/index.html");
		}
		
		//const token = localStorage.getItem('token');
		//console.log({ token })
	});
})();


(function() { // Register POST
	$('#registerform').submit(async e => {
		console.log(e);
		
		e.preventDefault();
		var nickname = $('#nickname').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
		var email = $('#email').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
		var password = $('#password').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
		const response = await fetch('/users/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, nickname })
		});

		let res = await response.json()
		localStorage.setItem('token', 'Bearer ' + res.token);
		if(response.status == 200){
			window.location.replace("/index.html");
		}
		//const token = localStorage.getItem('token');
		//console.log({ token })
	});
})();