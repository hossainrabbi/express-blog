require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const rootRouter = require('./routers');
const usersRouter = require('./routers/users');
const { initializingPassport } = require('./config/passportConfig');
const isAuth = require('./middleware/isAuth');

const app = express();

// initialize passport
initializingPassport(passport);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('public'));

// set view engine
app.set('view engine', 'ejs');

// using routing
app.use('/', rootRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000;

// mongoose connection
mongoose
  .connect('mongodb://127.0.0.1:27017/bdtask-node-project')
  .then(() => console.log('Database Connection Successfully!'))
  .catch(() => console.log('Database Connection Fail!'));

// creating server
app.listen(PORT, () => {
  console.log(`App is listen oh http://localhost:${PORT}`);
});
