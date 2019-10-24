const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secret')();
const Schema = mongoose.Schema;

const userSchema = Schema({
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
		},
		select: false
	},
	password: {
		type: String,
		required: true,
		minLength: 7,
		select: false
	},
	tokens: [
		{
			token: {
				type: String
			}
		}
		
	],
	select: false,
	groupChats: [
		{
			_id : Schema.ObjectId,
			name : String
		}
	],
	select : false
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
	const user = await User.findOne({ email }).select('+password');
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
