const router = require('express').Router();
const mongoose = require('mongoose');
const { validationResult, body } = require('express-validator');
const { isAdmin } = require('../middleware/isAuth');
const User = require('../models/User');
const Category = require('../models/Category');

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

      await User.updateOne(
        { _id: userId },
        { $set: { name, email, role } },
        { multi: true }
      );
      res.redirect(`/admin/dashboard/users/edit-user?userId=${userId}`);
    } catch (err) {
      next(err.message);
    }
  }
);

// remove user
router.get('/users/remove-user/:userId', isAdmin, async (req, res, next) => {
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

// get add create user
router.get('/users/add-user', isAdmin, async (req, res, next) => {
  try {
    res.render('dashboard/add-user', {
      title: 'Add User',
      user: req.user,
      userValue: {},
      error: '',
    });
  } catch (err) {
    next(err);
  }
});

// add create user
router.post(
  '/users/add-user',
  body('name', 'name is required').notEmpty(),
  body('role', 'role is required').notEmpty(),
  body('password', 'password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password minimum 6 characters'),
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
    const { name, email, role, password } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('dashboard/add-user', {
          title: 'Add User',
          user: req.user,
          userValue: req.body,
          error: 'Invalid Credentials',
        });
      }

      const user = new User({ name, email, role, password });
      await user.save();

      res.redirect(`/admin/dashboard/all-users`);
    } catch (err) {
      next(err.message);
    }
  }
);

// get categories page
router.get('/users/categories', isAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.render('dashboard/categories', {
      title: 'Categories Page',
      categories,
      user: req.user,
      error: '',
    });
  } catch (err) {
    next(err);
  }
});

// get add category page
router.get('/users/add-category', isAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.render('dashboard/add-category', {
      title: 'Category',
      user: req.user,
      categories,
      error: '',
    });
  } catch (err) {
    next(err);
  }
});

// create category
router.post('/users/add-category', isAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (!req.body.title) {
      return res.render('dashboard/add-category', {
        title: 'Category',
        user: req.user,
        categories,
        error: 'Category Title is required!',
      });
    }

    let slag = req.body.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    let matchCategories = await Category.find({
      title: { $regex: new RegExp(req.body.title, 'i') },
    });
    if (matchCategories.length > 0) {
      slag = `${slag}-${matchCategories.length}`;
    }

    const newCategories = new Category({
      ...req.body,
      slag,
    });

    await newCategories.save();

    return res.render('dashboard/add-category', {
      title: 'Category',
      user: req.user,
      categories,
      error: '',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
