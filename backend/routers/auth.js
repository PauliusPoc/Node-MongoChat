const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
	//add auth to register
	//Create new user
	try {
		const user = new User(req.body);
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
        res.status(400).send({error: "Check email and password"});
        
		console.error(error);
	}
});

router.post('/login', async (req, res) => {
	// todo /login
	console.log('requested');
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send({error:"Check email and password"});
		console.error(error);
	}
});

module.exports = router;