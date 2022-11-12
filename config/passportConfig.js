const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

const initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (username, password, done) {
        try {
          const user = await User.findOne({ email: username });
          if (!user) return done(null, false);
          const isMatch = await user.comparePasswordMatch(password);
          if (!isMatch) return done(null, false);

          return done(null, user);
        } catch (err) {
          done(err.message, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);

      done(null, user);
    } catch (err) {
      done(err.message, false);
    }
  });
};

module.exports = {
  initializingPassport,
};
