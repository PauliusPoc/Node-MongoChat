const Chat = require('../models/Chat');
const User = require('../models/User');
const connect = require('../db');

async function getUserById(userId) {
	const user = await User.findById(userId);
	return user;
}

async function addChatToUser(chatId, chatname, userId) {
	const response = await User.findOneAndUpdate(
		{ _id: userId },
		{ $addToSet: { groupChats: { _id: chatId, name: chatname } } },
		{ new: true }
	).select('+groupChats');
	return response;
}

function getChatBody(
	user2,
	chatType = 'private',
	user1Id,
	user1Nickname,
	name
) {
	const members = [
		{
			_id: user2._id,
			nickname: user2.nickname
		}
	];
	if (user1Id && user1Nickname) {
		members.push({
			_id: user1Id,
			nickname: user1Nickname
		});
	}
	let chat = new Chat({
		type: chatType,
		members,
		name: name
	});
	return chat;
}

module.exports = {
	getUserById,
	addChatToUser,
	getChatBody
};
