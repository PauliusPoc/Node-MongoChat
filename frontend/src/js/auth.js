(function() { //  login POST
	$('#loginform').submit(async e => {
		console.log(e);
		
		e.preventDefault();

		var email = $('#email').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
		var password = $('#password').val().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
		const response = await fetch('/auth/login', {
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
		const response = await fetch('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, nickname })
		});
		console.log('issiunte');
		let res = await response.json();
		console.log(res);
		localStorage.setItem('token', 'Bearer ' + res.token);
		if(response.status == 201){
			window.location.replace("/index.html");
		}
		//const token = localStorage.getItem('token');
		//console.log({ token })
	});
})();