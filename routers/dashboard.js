const router = require('express').Router();
const mongoose = require('mongoose');
const { validationResult, body } = require('express-validator');
const { isAdmin } = require('../middleware/isAuth');
const User = require('../models/User');

router.get('/', isAdmin, (req, res) => {
  res.render('dashboard/index', {
    title: 'Dashboard',
    user: req.user,
  });
});

// GET all users
router.get('/all-users', isAdmin, async (req, res, next) => {
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

// get update user page
router.get('/users/edit-user', isAdmin, async (req, res, next) => {
  const { userId } = req.query;

  try {
    let user = mongoose.isValidObjectId(userId);
    if (!user) {
      return next('User not found');
    }

    user = await User.findById(userId);
    if (!user) {
      return next('User not found');
    }

    res.render('dashboard/edit-user', {
      title: 'Dashboard - Edit User',
      user: req.user,
      editUser: user,
    });
  } catch (err) {
    next(err);
  }
});

// update user
router.post(
  '/users/edit-user',
  body('name', 'name is required').notEmpty(),
  body('role', 'role is required').notEmpty(),
  body('email', 'email is required')
    .isEmail()
    .withMessage('provide a valid email')
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) return Promise.reject('user already exist');
      });
    }),
  isAdmin,
  async (req, res, next) => {
    const { userId } = req.query;
    const { name, email, role } = req.body;

    try {
      let user = mongoose.isValidObjectId(userId);
      if (!user) {
        return next('User not found');
      }

      user = await User.findById(userId);
      if (!user) {
        return next('User not found');
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('dashboard/edit-user', {
          title: 'Dashboard - Edit User',
          user: req.user,
          editUser: user,
          errors: errors.array(),
        });
      }

      await User.updateOne({ _id: userId }, { name, email, role });
      res.redirect(`/admin/dashboard/users/edit-user?userId=${userId}`);
    } catch (err) {
      next(err.message);
    }
  }
);

// remove user
router.get('/users/remove-user/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    let user = mongoose.isValidObjectId(userId);
    if (!user) {
      return next('User not found');
    }

    user = await User.findById(userId);
    if (!user) {
      return next('User not found');
    }

    await user.remove();
    res.redirect('/admin/dashboard/all-users');
  } catch (err) {
    next(err);
  }
});

module.exports = router;