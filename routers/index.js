const router = require('express').Router();
var moment = require('moment');
const Post = require('../models/Post');
const View = require('../models/View');
const DeviceDetector = require('device-detector-js');

const deviceDetector = new DeviceDetector();

// show index page
router.get('/', async (req, res) => {
  const posts = await Post.find();

  res.render('index', {
    title: 'Home Page',
    user: req.user,
    posts,
    moment,
  });
});

// show post details page
router.get('/post/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    // pass request in viewAdd function
    viewAdd(req);

    res.render('post-details', {
      title: post.title,
      user: req.user,
      moment,
      post,
    });
  } catch (err) {
    next(err);
  }
});

// add view
async function viewAdd(req) {
  const { slug } = req.params;
  const date = Date.now();

  const device = deviceDetector.parse(req.get('User-Agent'));
  const response = await fetch('https://ifconfig.co/json');
  const ifconfig = await response.json();

  // find view with date, slug and userIp
  const findView = await View.findOne({
    date_at: date,
    postId: slug,
    userIp: req.ip,
  });

  const view = new View({
    postId: slug,
    userIp: req.ip,
    method: req.method,
    host: req.hostname,
    url: req.url,
    referer: req.headers.referer,
    user_agent: req.get('User-Agent'),
    country: ifconfig?.country || '',
    device: device?.device?.type || '',
    operating: device?.os?.name || '',
    browser: device?.client?.name || '',
    browser_version: device?.client?.version || '',
    time_zone: ifconfig?.time_zone || '',
    asn: ifconfig?.asn || '',
    asn_org: ifconfig?.asn_org || '',
    date_at: Date.now(),
  });

  if (findView === null) {
    await view.save();
  }
}

// show about page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page', user: req.user || null });
});

module.exports = router;
