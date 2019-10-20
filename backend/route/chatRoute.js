const Chat = require('../models/chat');
const connect = require('../db');
const express = require('express');

const router = express.Router()

router.route('/').get((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    connect.then(db => {
        Chat.find({}).then(chat => {
            res.json(chat);
        });
    });
})

module.exports = router;