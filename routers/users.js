const router = require('express').Router();
const passport = require('passport');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');

router.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('register', {
    title: 'Register Page',
    errors: [],
    user: null,
    userValue: null,
  });
});

router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('login', {
    title: 'Login Page',
    user: null,
  });
});

router.post(
  '/register',
  body('name', 'name is required').notEmpty(),
  body('email', 'email is required')
    .isEmail()
    .withMessage('provide a valid email')
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) return Promise.reject('user already exist');
      });
    }),
  body('password', 'password is required')
    .isLength({ min: 6 })
    .withMessage('minimum password length is 6 characters'),

  async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('register', {
          title: 'Register',
          errors: errors.array(),
          user: null,
          userValue: req.body,
        });
      }

      let user = new User({ name, email, password });
      user = await user.save();
      if (!user) {
        return res.render('register', {
          title: 'Register',
          errors: [
            {
              msg: 'Something is Problem',
            },
          ],
          user: null,
        });
      }

      return res.redirect('/users/login');
    } catch (err) {
      res.render('register', {
        title: 'Register',
        errors: [
          {
            msg: err.message,
          },
        ],
        user: null,
      });
    }
  }
);

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/',
  })
);

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/users/login');
  });
});

module.exports = router;
