const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to the database'))
  .catch((error) => {
    console.log(
      'There has been an error trying to connect to the database ===> ',
      error
    );
  });

module.exports;
