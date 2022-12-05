const router = require('express').Router();
var moment = require('moment');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  const posts = await Post.find();

  res.render('index', {
    title: 'Home Page',
    user: req.user,
    posts,
    moment,
  });
});

router.get('/post/:slug', async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });

  res.render('post-details', {
    title: post.title,
    user: req.user,
    moment,
    post,
  });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page', user: req.user || null });
});

module.exports = router;
