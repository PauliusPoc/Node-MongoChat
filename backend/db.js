const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = 'mongodb://localhost/mongochat';
const connect = mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
});

module.exports = connect;
