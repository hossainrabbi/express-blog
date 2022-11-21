const router = require('express').Router();
const { isAuth } = require('../middleware/isAuth');

router.get('/', isAuth, async (req, res) => {
  res.render('index', {
    title: 'Home Page',
    user: req.user,
  });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page', user: req.user || null });
});

module.exports = router;
