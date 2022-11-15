const router = require('express').Router();
const isAuth = require('../middleware/isAuth');
const User = require('../models/User');

// get home page
router.get('/', isAuth, async (req, res) => {
  try {
    const users = await User.find();

    res.render('index', {
      title: 'Users Page',
      user: req.user,
      users: users || null,
    });
  } catch (err) {
    next(err);
  }
});

// get about page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page', user: req.user || null });
});

module.exports = router;
