const express = require('express');
const messageRoutes = express.Router();

const mongoose = require('mongoose');

const User = require('../models/User');
const Message = require('../models/Message');

messageRoutes.post('/new', (req, res, next) => {
  const { content, language, group, loggedInUser } = req.body;
  if (!content || !loggedInUser) {
    return res.status(400).json({ message: 'Provide content and user' });
  }
  const newMessage = {
    content,
    creator: loggedInUser._id,
  };
  if (language) {
    newMessage.language = language;
  }

  if (group) {
    newMessage.group = group._id;
  }
  Message.create(newMessage)
    .then((messageFromDB) => {
      console.log('Newly created message is: ', messageFromDB);
      res.status(200).json(messageFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log('error ==> ', error);
        res.status(500).json({ errorMessage: error.message });
      } else {
        console.log('error ==> ', error);
        next(error);
      }
    });
});

messageRoutes.get('/all', async (req, res, next) => {
  const messages = await Message.find({ group: null })
    .then((messagesFromDB) => {
      console.log(
        `${messagesFromDB.length} messages were retrieved from the database.`
      );
      res.status(200).json(messagesFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log('error ==> ', error);
        res.status(500).json({ errorMessage: error.message });
      } else {
        console.log('error ==> ', error);
        next(error);
      }
    });
});

module.exports = messageRoutes;
