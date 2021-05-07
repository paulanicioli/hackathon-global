require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

require('./configs/passport');

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const session = require('express-session');
const passport = require('passport');

const app = express();

app.use(
  session({
    secret: 'some secret goes here',
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//  Let's uncomment this portion later on so it handles errors

// app.use((req, res, next) => {
//     res.status(404);
//     res.render('not-found');
//   });

// app.use((err, req, res, next) => {
//   console.error('ERROR', req.method, req.path, err);

//   if (!res.headersSent) {
//     res.status(500);
//     res.render('error');
//   }
// });

app.listen(process.env.PORT, () => {
  console.log('App rodando na porta ', process.env.PORT);
});

module.exports = app;
