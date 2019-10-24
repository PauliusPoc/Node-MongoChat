const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	//View all logged user profiles
	try {
		User.find({}).then(user => {
			res.status(200).json(user);
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

router.put(`/me`, auth, async (req, res, next) => {
    // Change username
	try {
		const user = req.user;
		user.nickname = req.body.username;
		const token = await user.generateAuthToken();
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token != req.token;
		});
		await user.save();
		res.status(200).send({ token });
	} catch (error) {
		res.status(400).send(error);
	}
});



router.get('/me', auth, async (req, res) => {
	//View logged in user profile
	try {
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/me/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token != req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post('/me/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens.splice(0, req.user.tokens.length);
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
