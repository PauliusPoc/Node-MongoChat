const Chat = require('../models/Chat');
const User = require('../models/User');
const express = require('express');
const helpers = require('../helpers/helpers');

const router = express.Router();

router.post('/', async (req, res) => {
	// Create group chat
	try {
		const chat = helpers.getChatBody(
			req.user,
			'group',
			null,
			null,
			req.body.name
		);
		await chat.save();
		await helpers.addChatToUser(chat._id, chat.name, req.user._id);
		res.status(201).send(chat);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/', async (req, res) => {
	// Get group chats of user
	try {
		const groupChats = await User.findById(req.user._id).select('+groupChats');
		res.status(201).send(groupChats.groupChats);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/private/:userId', async (req, res) => {
	//TODO delete private
	//get private chat
	try {
		const chat = await Chat.findOne({
			$and: [
				{ type: 'private' },
				{
					members: {
						$elemMatch: {
							_id: req.params.userId
						}
					}
				},
				{
					members: {
						$elemMatch: {
							_id: req.user._id
						}
					}
				}
			]
		});
		if (chat) {
			console.log('fetched chat');
			res.send(chat._id);
		} else {
			const user1 = await helpers.getUserById(req.params.userId);
			console.log(user1.nickname);
			const newChat = helpers.getChatBody(
				req.user,
				'private',
				user1._id,
				user1.nickname
			);
			await newChat.save();
			console.log('created new chat');
			res.status(201).send(newChat._id);
		}
	} catch (error) {
		res.status(400).send(error);
	}
});
//console.log(req.user._id);
//res.json({});

router.put('/newMessage', async (req, res, next) => {
	// Adds new message to chat
	try {
		let chatMessage = {
			message: req.body.msg,
			sender: req.user.nickname
		};
		const response = await Chat.findOneAndUpdate(
			{ _id: req.body.chatId },
			{ $push: { messages: chatMessage } },
			{ new: true }
		);
		res.status(201).send();
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get(`/group/:chatId`, async (req, res, next) => {
	//gets ID of a group chat
	try {
		Chat.findById(req.params.chatId).then(chat => {
			res.status(200).send(chat._id);
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get(`/:chatId`, async (req, res, next) => {
	try {
		Chat.findById(req.params.chatId).then(chat => {
			res.send(chat);
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

router.put(`/:chatId`, async (req, res, next) => {
	//add user to group chat
	try {
		let data = await helpers.addChatToUser(
			req.params.chatId,
			req.body.name,
			req.body._id
		);
		Chat.findOneAndUpdate(
			{ _id: req.params.chatId },
			{
				$addToSet: {
					members: {
						_id: req.body._id,
						nickname: data.nickname
					}
				}
			},
			{ new: true }
		).exec((err, response) => {
			res.json(response);
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
