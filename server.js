//npm packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: 'config.env' });
const cookieParser = require('cookie-parser');
//custom packages
const connectDb = require('./db/connectDb');
const { notFound, ErrorHandler } = require('./utils/ErorHandler');

//define constant variables
const app = express();
const PORT = process.env.PORT || 4000;
const MongoUrl = process.env.MONGO_URL;
//built in middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors());

//Routing
app.use('/api/users', require('./routes/user.router'));
app.use('/api/anbar', require('./routes/anbar.router'));
app.use('/api/transaction/out', require('./routes/tranOut.router'));
app.use('/api/transaction/input', require('./routes/tranIn.router'));
app.use('/api/reservations', require('./routes/reservation.router'));

//Error Middlewares
app.use(notFound);
app.use(ErrorHandler);
//Connecting to db and listening on port
const start = () => {
  try {
    mongoose
      .connect(MongoUrl)
      .then(() => {
        app.listen(PORT, () => {
          console.log('connected to alll');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
start();
