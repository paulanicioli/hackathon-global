const express = require('express');
const { format } = require('date-format-parse');
require('dotenv').config();

const router = express();

const mongoose = require('mongoose');

const User = require('../models/User');

const bcrypt = require('bcrypt');

const fileUploader = require('../config/cloudinary.config');

router.get('/login', (req, res) => {
  res.render('login');
});
