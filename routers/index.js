const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const user = await User.find();
    res.render('index', { title: 'Users Page', user });
  } catch (err) {
    console.log('get', err);
  }
});

module.exports = router;
