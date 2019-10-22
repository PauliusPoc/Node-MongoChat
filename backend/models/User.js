const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secret')();

const userSchema = mongoose.Schema({
	nickname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: value => {
			if (!validator.isEmail(value)) {
				throw new Error({ error: 'Invalid email adress' });
			}
		}
	},
	password: {
		type: String,
		required: true,
		minLength: 7
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

userSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		if(user.password.length < 7){
			throw new Error('Password is too short')
		}
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id, nickname: user.nickname }, JWT_KEY);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Invalid login credentials');
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		throw new Error('Invalid login credentials');
	}
	return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
