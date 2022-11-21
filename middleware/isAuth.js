const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/users/login');
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return next();
    }

    return res.redirect('/');
  }

  return res.redirect('/users/login');
};

module.exports = {
  isAuth,
  isAdmin,
};
