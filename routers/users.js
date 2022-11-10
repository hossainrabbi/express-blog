const User = require('../models/User');

const router = require('express').Router();

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register Page',
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login Page',
  });
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return console.log('user already exist');
    }

    user = new User({ name, email, password });
    user = await user.save();
    if (!user) {
      return console.log('Something Problems!');
    }

    return res.redirect('/users/login');
  } catch (err) {
    console.log(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return console.log('Invalid email or password');
    }

    const isMatch = await user.comparePasswordMatch(password);
    if (!isMatch) {
      return console.log('Invalid email or password');
    }

    return res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
