const express = require('express');

const authRoutes = require('./routes/auth.routes');

const cookieParser = require('cookie-parser');

const app = express();

require('./configs/mongodb.config');

require('dotenv').config();

app.use(express.static('public'));

app.use(cookieParser());
const sessionConfig = require('./configs/session.config');

sessionConfig(app);

app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

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
