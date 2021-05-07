const express = require('express');
const { format } = require('date-format-parse');
require('dotenv').config();

const router = express();

const mongoose = require('mongoose');

const User = require('../models/User');

const bcrypt = require('bcrypt');

const fileUploader = require('../config/cloudinary.config');

router.get('/login', (req, res) => {
  res.renderFiles('login');
});

router.post('/login', async (req, res) => {
  try {
    const { userNickname, userPassword } = req.body;

    const userFromDb = await User.findOne({
      nickname: userNickname,
    });

    if (!userFromDb) {
      console.log('Could not find user in db');
      return res.render('login', {
        loginError: 'Wrong nickname or password',
        userEmail,
      });
    }
    const isPasswordValid = bcrypt.compareSync(
      userPassword,
      userFromDb.password
    );

    if (!isPasswordValid) {
      return res.render('login', {
        loginError: 'Wrong nickname or password',
        userEmail,
      });
    }

    req.session.currentUser = userFromDb;

    res.redirect('/messages');
  } catch (error) {
    console.log('Error in the login route ===> ', error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});
