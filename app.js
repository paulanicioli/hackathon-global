require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const User = require('./models/User');
const Message = require('./models/Message');

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
});

const session = require('express-session');
const passport = require('passport');

require('./configs/passport.config');
require('./configs/mongodb.config');

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express View engine setup
app.use(express.static(path.join(__dirname, 'public')));

// SESSION SETTINGS:
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ROUTES MIDDLEWARE:

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const messageRoutes = require('./routes/messages.routes');
app.use('/api/messages', messageRoutes);

server.listen(process.env.PORT, () => {
  console.log('Listening on port' + ' ' + process.env.PORT);
});

//socket io

//listen to all incoming messages
io.on('connection', (socket) => {
  console.log('New IO connection');
  //this is an object of the socket connection
  // console.log('socket id: ', socket.id);

  socket.on('message', (data) => {
    console.log('data: ', data);
    io.emit('new-message', data);
  });

  // Returning the initial data of all messages
  socket.on('initial_messages', () => {
    Message.find({}).then((messages) => {
      io.sockets.emit('get_messages', messages);
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

module.exports = app;
