require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const session = require('express-session');
const passport = require('passport');

require('./configs/passport.config');
require('./configs/mongodb.config');

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// SESSION SETTINGS:
app.use(
  session({
    secret: 'some secret goes here',
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);

// ROUTES MIDDLEWARE:

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('listening');
});

module.exports = app;
