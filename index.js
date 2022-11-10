const express = require('express');
const mongoose = require('mongoose');
const rootRouter = require('./routers');
const usersRouter = require('./routers/users');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// set view engine
app.set('view engine', 'ejs');

// using routing
app.use('/', rootRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000;

// mongoose connection
mongoose
  .connect('mongodb://localhost:27017/bdtask-node-project')
  .then(() => console.log('Database Connection Successfully!'))
  .catch(() => console.log('Database Connection Fail!'));

// creating server
app.listen(PORT, () => {
  console.log(`App is listen oh http://localhost:${PORT}`);
});
