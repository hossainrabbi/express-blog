const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const user = await User.find();
    res.render('index', { title: 'Hello Express', user });
  } catch (err) {
    console.log('get', err);
  }
});

router.post('/register', async (req, res, next) => {
  const { name, username } = req.body;
  try {
    let user = new User({ name, username });
    user = await user.save();
    res.redirect('/');
  } catch (err) {
    console.log('register', err);
  }
});

module.exports = router;
