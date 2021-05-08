// routes/auth-routes.js

const express = require('express');
const authRoutes = express.Router();

const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const SALT_ROUNDS = 10;

const User = require('../models/User');

authRoutes.post('/signup', (req, res, next) => {
  const { nickname, email, birthDate, gender, language, password } = req.body;

  if (!nickname || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).json({
      errorMessage:
        'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  bcryptjs
    .genSalt(SALT_ROUNDS)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        nickname,
        email,
        birthDate,
        gender,
        language,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB);
      res.status(200).json(userFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).json({
          errorMessage:
            'Username and email need to be unique. Either username or email is already used.',
        });
      } else {
        next(error);
      }
    });
});

module.exports = authRoutes;
