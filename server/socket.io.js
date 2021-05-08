require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:' + '3000',
	},
});
const session = require('express-session');
const passport = require('passport');

require('./configs/passport.config');
require('./configs/mongodb.config');

// Middleware Setup
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express View engine setup
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

// ROUTES MIDDLEWARE:

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);


//listen to all incoming messages
io.on('connection', (socket) => {
	console.log('new connection');
	//this is an object of the socket connection
	// console.log('socket id: ', socket.id);

	socket.on('message', (data) => {
		console.log('data: ', data);
		io.emit('new-message', data);
	});

	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});

module.exports = app;
