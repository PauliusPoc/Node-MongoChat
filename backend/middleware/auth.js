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
			const token = req.header('authorization').replace('Bearer ', ''); //try without replace?
			const data = jwt.verify(token, JWT_KEY);
			const user = await User.findOne({ _id: data._id, 'tokens.token': token });
			if (!user) {
				throw new Error();
			}
			req.user = user;
			req.token = token;
            next();
		} else {
            res.status(401).send({error : 'No token!'}) //might be problematic
        }
	} catch (error) {
		res.status(401).send({ error: 'Not authorised to access this page' });
	}
};

module.exports = auth;
