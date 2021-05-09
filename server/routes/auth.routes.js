const express = require('express');
const authRoutes = express.Router();

const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const SALT_ROUNDS = 10;

const User = require('../models/User');

authRoutes.post('/signup', (req, res, next) => {
  console.log('post call on signup')


  const { username, email, birthDate, gender, language, password } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: 'Provide username, email and password' });
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    return res.status(500).json({
      errorMessage:
        'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
    });
  }

  const newUser = {
    username,
    email,
  };

  if (gender) {
    newUser.gender = gender;
  }

  if (language) {
    newUser.language = language;
  }

  if (birthDate) {
    newUser.birthDate = birthDate;
  }

  console.log(newUser)

  bcryptjs
    .genSalt(SALT_ROUNDS)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      newUser.password = hashedPassword;
      return User.create(newUser);
    })
    .then((userFromDB) => {
      console.log(userFromDB)
      console.log('Newly created user is: ', userFromDB);
      res.status(200).json(userFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log('error ==> ', error);
        res.status(500).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log('error ==> ', error);
        res.status(500).json({
          errorMessage:
            'Username and email need to be unique. Either username or email is already being used.',
        });
      } else {
        console.log('error ==> ', error);
        next(error);
      }
    });
});

authRoutes.post('/login', async (req, res, next) => {
  await passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      console.log('Error 1 ===> ', err);
      res
        .status(500)
        .json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      console.log('Error 2 ===> ', failureDetails);
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        console.log('Error 3 ===> ', err);
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});

authRoutes.post('/logout', async (req, res, next) => {
  await req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = authRoutes;
