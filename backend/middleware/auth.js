const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_KEY = require('../secret')();

const auth = async (req, res, next) => {
	try {
		//console.log(req)
		if (
			req.hasOwnProperty('headers') &&
			req.headers.hasOwnProperty('authorization')
		) {
			const token = req.header('authorization').replace('Bearer ', '');
			const data = jwt.verify(token, JWT_KEY);
			const user = await User.findOne({ _id: data._id, 'tokens.token': token }).select('+tokens');
			if (!user) {
				throw new Error('Invalid token');
			}
			req.user = user;
			req.token = token;
			next();
		} else {
			res.status(401).send('No token!');
		}
	} catch (error) {
		res.status(401).send('Not authorised to access this page');
	}
};



module.exports = auth;
