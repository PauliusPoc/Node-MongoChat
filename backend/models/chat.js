const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    type: String ,
    members: [
        {
            _id : Schema.ObjectId,
            nickname: String
        }
    ],
    messages: [
        {
        message:  String,
        sender: String,
        date: { type: Date, default: Date.now }
    }],
    name : String
});

chatSchema.methods.addMessage = async function(msg) {
    const chat = Chat.findById( msg.chatId );
    console.log(chat);
    const message = {message : msg.message, sender: msg.sender}
	chat.messages = chat.messages.push({message});
	await chat.save();
};

let Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;