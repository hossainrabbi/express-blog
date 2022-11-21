const router = require('express').Router();
const { isAdmin } = require('../middleware/isAuth');
const User = require('../models/User');

router.get('/', isAdmin, (req, res) => {
  res.render('dashboard/index', {
    title: 'Dashboard',
    user: req.user,
  });
});

router.get('/all-users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();

    res.render('dashboard/all-user', {
      title: 'Users - Dashboard',
      user: req.user,
      users: users || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
